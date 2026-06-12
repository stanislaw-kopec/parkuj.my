package my.parkuj.application.controller;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import my.parkuj.application.enums.ReservationStatus;
import my.parkuj.application.model.ParkingLot;
import my.parkuj.application.model.Reservation;
import my.parkuj.application.repository.AdminUserRepository;
import my.parkuj.application.repository.CustomerRepository;
import my.parkuj.application.repository.IncidentReportRepository;
import my.parkuj.application.repository.ParkingLotRepository;
import my.parkuj.application.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private static final List<ReservationStatus> BLOCKING_STATUSES = List.of(
        ReservationStatus.PENDING, ReservationStatus.CONFIRMED, ReservationStatus.ACTIVE
    );

    private final ParkingLotRepository parkingLotRepository;
    private final CustomerRepository customerRepository;
    private final ReservationRepository reservationRepository;
    private final IncidentReportRepository incidentReportRepository;
    private final AdminUserRepository adminUserRepository;

    public StatsController(
        ParkingLotRepository parkingLotRepository,
        CustomerRepository customerRepository,
        ReservationRepository reservationRepository,
        IncidentReportRepository incidentReportRepository,
        AdminUserRepository adminUserRepository
    ) {
        this.parkingLotRepository = parkingLotRepository;
        this.customerRepository = customerRepository;
        this.reservationRepository = reservationRepository;
        this.incidentReportRepository = incidentReportRepository;
        this.adminUserRepository = adminUserRepository;
    }

    // Publiczne statystyki sieci — kafelki na HomePage.
    @GetMapping("/overview")
    public Map<String, Object> getOverview() {
        List<ParkingLot> active = parkingLotRepository.findByStatusIgnoreCaseOrderByNameAsc("ACTIVE");
        int totalPlaces = active.stream()
            .mapToInt(lot -> lot.getPlacesCount() != null ? lot.getPlacesCount() : 0)
            .sum();
        Map<String, Object> response = new HashMap<>();
        response.put("totalPlaces", totalPlaces);
        response.put("totalParkingLots", active.size());
        return response;
    }

    // Statystyki dla panelu admina — 4 hero kafelki. Ujawniają łączny przychód,
    // więc tak jak /api/admin/* wymagają identyfikatora aktywnego admina.
    @GetMapping("/admin")
    public Map<String, Object> getAdminStats(@RequestParam Integer adminId) {
        boolean ok = adminId != null && adminUserRepository.findById(adminId)
            .map(a -> !"INACTIVE".equalsIgnoreCase(a.getStatus()))
            .orElse(false);
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wymagane konto administratora.");
        }
        // Admin aplikacji odpowiada za ruch, nie za pieniądze — kafelek przychodu
        // został wycięty świadomie. Wykluczone z odpowiedzi, więc też nie liczymy.
        long totalCustomers = customerRepository.count();

        long activeReservations = reservationRepository.findAll().stream()
            .filter(r -> BLOCKING_STATUSES.contains(r.getStatus()))
            .count();

        long openIncidents = incidentReportRepository.countByStatusIgnoreCase("OPEN");

        Map<String, Object> response = new HashMap<>();
        response.put("totalCustomers", totalCustomers);
        response.put("activeReservations", activeReservations);
        response.put("openIncidents", openIncidents);
        return response;
    }

    // Statystyki dla profilu klienta — UserPage.
    @GetMapping("/customer")
    public Map<String, Object> getCustomerStats(@RequestParam Integer customerId) {
        List<Reservation> reservations =
            reservationRepository.findByCustomerCustomerIdOrderByReservedAtDesc(customerId);
        long total = reservations.size();
        BigDecimal spent = reservations.stream()
            .filter(r -> r.getStatus() != ReservationStatus.CANCELLED
                && r.getStatus() != ReservationStatus.EXPIRED)
            .map(Reservation::getPriceEstimated)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, Object> response = new HashMap<>();
        response.put("totalReservations", total);
        response.put("totalSpent", spent);
        return response;
    }
}

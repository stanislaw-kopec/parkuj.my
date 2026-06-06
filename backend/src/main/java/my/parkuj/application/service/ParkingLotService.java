package my.parkuj.application.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import my.parkuj.application.dto.AvailabilityDTO;
import my.parkuj.application.dto.ParkingLotConfigDTO;
import my.parkuj.application.dto.ParkingLotDTO;
import my.parkuj.application.dto.ParkingLotStatsDTO;
import my.parkuj.application.dto.PriceEstimateDTO;
import my.parkuj.application.enums.ReservationStatus;
import my.parkuj.application.model.ParkingLot;
import my.parkuj.application.model.PricingPlan;
import my.parkuj.application.model.Reservation;
import my.parkuj.application.repository.ParkingLotRepository;
import my.parkuj.application.repository.ReservationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ParkingLotService {

    private static final List<ReservationStatus> BLOCKING_STATUSES = List.of(
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.ACTIVE
    );

    private final ParkingLotRepository parkingLotRepository;
    private final ReservationRepository reservationRepository;
    private final PricingService pricingService;

    public ParkingLotService(
        ParkingLotRepository parkingLotRepository,
        ReservationRepository reservationRepository,
        PricingService pricingService
    ) {
        this.parkingLotRepository = parkingLotRepository;
        this.reservationRepository = reservationRepository;
        this.pricingService = pricingService;
    }

    public List<ParkingLotDTO> getActiveParkingLots() {
        return parkingLotRepository.findByStatusIgnoreCaseOrderByNameAsc("ACTIVE")
            .stream()
            .map(this::toDto)
            .toList();
    }

    public ParkingLotDTO getParkingLot(Integer parkingLotId) {
        return toDto(findParkingLot(parkingLotId));
    }

    public AvailabilityDTO checkAvailability(Integer parkingLotId, LocalDateTime from, LocalDateTime to) {
        validateRange(from, to);
        ParkingLot parkingLot = findParkingLot(parkingLotId);
        int capacity = parkingLot.getReservablePlacesCount() != null ? parkingLot.getReservablePlacesCount() : 0;
        long occupied = reservationRepository.countOverlappingReservations(
            parkingLotId,
            from,
            to,
            BLOCKING_STATUSES
        );
        int occupiedSafe = Math.toIntExact(Math.min(occupied, Integer.MAX_VALUE));
        int availableSpots = Math.max(0, capacity - occupiedSafe);

        AvailabilityDTO dto = new AvailabilityDTO();
        dto.setParkingLotId(parkingLotId);
        dto.setAvailable(availableSpots > 0);
        dto.setTotalReservableSpots(capacity);
        dto.setOccupiedReservableSpots(Math.min(occupiedSafe, capacity));
        dto.setAvailableSpots(availableSpots);
        return dto;
    }

    public PriceEstimateDTO estimatePrice(Integer parkingLotId, LocalDateTime from, LocalDateTime to) {
        findParkingLot(parkingLotId);
        return pricingService.calculatePrice(parkingLotId, from, to);
    }

    // US-A05 — operator zmienia podział: ile ogółem, ile na rezerwacje online.
    @Transactional
    public ParkingLotDTO updateConfig(Integer parkingLotId, ParkingLotConfigDTO config) {
        if (config == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Brak danych konfiguracji.");
        }
        ParkingLot lot = findParkingLot(parkingLotId);

        if (config.getPlacesCount() != null) {
            if (config.getPlacesCount() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Liczba miejsc nie może być ujemna.");
            }
            lot.setPlacesCount(config.getPlacesCount());
        }
        if (config.getReservablePlacesCount() != null) {
            if (config.getReservablePlacesCount() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Liczba miejsc rezerwowanych nie może być ujemna.");
            }
            lot.setReservablePlacesCount(config.getReservablePlacesCount());
        }
        if (lot.getReservablePlacesCount() > lot.getPlacesCount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Liczba miejsc rezerwowanych nie może przekraczać liczby miejsc ogółem.");
        }

        return toDto(parkingLotRepository.save(lot));
    }

    // Statystyki dla panelu operatora — bieżący stan + 7-dniowa historia rezerwacji i przychodu.
    public ParkingLotStatsDTO getStats(Integer parkingLotId) {
        ParkingLot lot = findParkingLot(parkingLotId);

        ParkingLotStatsDTO stats = new ParkingLotStatsDTO();
        stats.setParkingLotId(lot.getParkingLotId());
        stats.setParkingLotName(lot.getName());
        stats.setPlacesCount(lot.getPlacesCount());
        stats.setReservablePlacesCount(lot.getReservablePlacesCount());
        stats.setWalkInPlacesCount(Math.max(0, lot.getPlacesCount() - lot.getReservablePlacesCount()));

        stats.setActiveReservationsCount(
            reservationRepository.countByParkingLotAndStatuses(parkingLotId, BLOCKING_STATUSES)
        );

        // Bieżący miesiąc — liczba i suma priceEstimated dla wszystkich rezerwacji.
        YearMonth thisMonth = YearMonth.from(LocalDate.now());
        LocalDateTime monthStart = thisMonth.atDay(1).atStartOfDay();
        LocalDateTime monthEnd = thisMonth.atEndOfMonth().atTime(23, 59, 59);
        List<Reservation> monthly = reservationRepository
            .findByParkingLotParkingLotIdAndReservedAtBetween(parkingLotId, monthStart, monthEnd);
        stats.setReservationsThisMonth(monthly.size());
        BigDecimal monthRevenue = monthly.stream()
            .filter(r -> r.getPriceEstimated() != null)
            .filter(r -> r.getStatus() != ReservationStatus.CANCELLED && r.getStatus() != ReservationStatus.EXPIRED)
            .map(Reservation::getPriceEstimated)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setRevenueThisMonth(monthRevenue);

        // 7-dniowa historia — agregacja po dniu reservedAt.
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);
        List<Reservation> weekly = reservationRepository.findByParkingLotParkingLotIdAndReservedAtBetween(
            parkingLotId, weekStart.atStartOfDay(), today.atTime(23, 59, 59)
        );

        Map<LocalDate, BigDecimal> revenueByDay = new HashMap<>();
        Map<LocalDate, Long> countsByDay = new HashMap<>();
        for (Reservation r : weekly) {
            if (r.getReservedAt() == null) continue;
            LocalDate day = r.getReservedAt().toLocalDate();
            countsByDay.merge(day, 1L, Long::sum);
            if (r.getPriceEstimated() != null
                && r.getStatus() != ReservationStatus.CANCELLED
                && r.getStatus() != ReservationStatus.EXPIRED) {
                revenueByDay.merge(day, r.getPriceEstimated(), BigDecimal::add);
            }
        }

        List<ParkingLotStatsDTO.DailyPoint> revenuePoints = new ArrayList<>();
        List<ParkingLotStatsDTO.DailyPoint> countPoints = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate d = weekStart.plusDays(i);
            String iso = d.toString();
            revenuePoints.add(new ParkingLotStatsDTO.DailyPoint(
                iso, revenueByDay.getOrDefault(d, BigDecimal.ZERO), 0
            ));
            countPoints.add(new ParkingLotStatsDTO.DailyPoint(
                iso, BigDecimal.ZERO, countsByDay.getOrDefault(d, 0L)
            ));
        }
        stats.setRevenueLast7Days(revenuePoints);
        stats.setReservationsLast7Days(countPoints);

        return stats;
    }

    private ParkingLot findParkingLot(Integer parkingLotId) {
        return parkingLotRepository.findById(parkingLotId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono parkingu."));
    }

    private ParkingLotDTO toDto(ParkingLot parkingLot) {
        PricingPlan activePlan = null;
        try {
            activePlan = pricingService.getActivePlan(parkingLot.getParkingLotId());
        } catch (ResponseStatusException ignored) {
            activePlan = null;
        }

        ParkingLotDTO dto = new ParkingLotDTO();
        dto.setId(parkingLot.getParkingLotId());
        dto.setName(parkingLot.getName());
        dto.setAddress(parkingLot.getAddress());
        dto.setLatitude(parkingLot.getLatitude());
        dto.setLongitude(parkingLot.getLongitude());
        dto.setPlacesCount(parkingLot.getPlacesCount());
        dto.setReservablePlacesCount(parkingLot.getReservablePlacesCount());
        dto.setWalkInPlacesCount(Math.max(0, parkingLot.getPlacesCount() - parkingLot.getReservablePlacesCount()));
        dto.setStatus(parkingLot.getStatus());
        if (activePlan != null) {
            dto.setPricePerHour(activePlan.getPricePerHour());
            dto.setCurrency(activePlan.getCurrency());
        }
        return dto;
    }

    private void validateRange(LocalDateTime from, LocalDateTime to) {
        if (from == null || to == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Podaj parametry from i to.");
        }
        if (!to.isAfter(from)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parametr to musi być późniejszy niż from.");
        }
    }
}


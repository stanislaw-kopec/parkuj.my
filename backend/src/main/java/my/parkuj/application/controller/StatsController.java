package my.parkuj.application.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import my.parkuj.application.model.ParkingLot;
import my.parkuj.application.repository.ParkingLotRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Publiczne statystyki sieci — dla HomePage (kafelki "X miejsc · Y parkingów").
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final ParkingLotRepository parkingLotRepository;

    public StatsController(ParkingLotRepository parkingLotRepository) {
        this.parkingLotRepository = parkingLotRepository;
    }

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
}

package my.parkuj.application.controller;

import java.time.LocalDateTime;
import java.util.List;
import my.parkuj.application.dto.AvailabilityDTO;
import my.parkuj.application.dto.ParkingLotConfigDTO;
import my.parkuj.application.dto.ParkingLotDTO;
import my.parkuj.application.dto.ParkingLotStatsDTO;
import my.parkuj.application.dto.PriceEstimateDTO;
import my.parkuj.application.service.ParkingLotService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parking-lots")
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    public ParkingLotController(ParkingLotService parkingLotService) {
        this.parkingLotService = parkingLotService;
    }

    @GetMapping
    public List<ParkingLotDTO> getParkingLots() {
        return parkingLotService.getActiveParkingLots();
    }

    @GetMapping("/{id}")
    public ParkingLotDTO getParkingLot(@PathVariable Integer id) {
        return parkingLotService.getParkingLot(id);
    }

    @GetMapping("/{id}/availability")
    public AvailabilityDTO getAvailability(
        @PathVariable Integer id,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return parkingLotService.checkAvailability(id, from, to);
    }

    @GetMapping("/{id}/price")
    public PriceEstimateDTO getPrice(
        @PathVariable Integer id,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return parkingLotService.estimatePrice(id, from, to);
    }

    // Statystyki dla panelu operatora (US-A02): kafelki + wykresy z prawdziwego SQL.
    @GetMapping("/{id}/stats")
    public ParkingLotStatsDTO getStats(@PathVariable Integer id) {
        return parkingLotService.getStats(id);
    }

    // US-A05 — zmiana podziału miejsc (ogółem vs rezerwowane online).
    @PatchMapping("/{id}/config")
    public ParkingLotDTO updateConfig(
        @PathVariable Integer id,
        @RequestBody ParkingLotConfigDTO config
    ) {
        return parkingLotService.updateConfig(id, config);
    }
}


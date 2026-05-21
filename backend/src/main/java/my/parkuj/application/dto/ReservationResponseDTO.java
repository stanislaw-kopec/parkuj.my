package my.parkuj.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import my.parkuj.application.enums.ReservationStatus;
import my.parkuj.application.model.Reservation;

public class ReservationResponseDTO {
    private Integer reservationId;
    private String reservationCode;
    private ReservationStatus status;
    private String parkingLotName;
    private String plateNumber;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private BigDecimal priceEstimated;

    public Integer getReservationId() { return reservationId; }
    public void setReservationId(Integer reservationId) { this.reservationId = reservationId; }

    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public String getParkingLotName() { return parkingLotName; }
    public void setParkingLotName(String parkingLotName) { this.parkingLotName = parkingLotName; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public BigDecimal getPriceEstimated() { return priceEstimated; }
    public void setPriceEstimated(BigDecimal priceEstimated) { this.priceEstimated = priceEstimated; }

    public static ReservationResponseDTO fromEntity(Reservation reservation) {
        if (reservation == null) return null;
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.reservationId = reservation.getReservationId();
        dto.reservationCode = reservation.getReservationCode();
        dto.status = reservation.getStatus();
        dto.parkingLotName = reservation.getParkingLot() != null ? reservation.getParkingLot().getName() : null;
        dto.plateNumber = reservation.getVehicle() != null ? reservation.getVehicle().getPlateNumber() : null;
        dto.startAt = reservation.getStartAt();
        dto.endAt = reservation.getEndAt();
        dto.priceEstimated = reservation.getPriceEstimated();
        return dto;
    }
}


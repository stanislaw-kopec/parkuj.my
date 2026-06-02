package my.parkuj.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import my.parkuj.application.enums.ReservationStatus;
import my.parkuj.application.model.Reservation;

public class ReservationResponseDTO {
    private Integer reservationId;
    private Integer customerId;
    private Integer vehicleId;
    private String reservationCode;
    private ReservationStatus status;
    private Integer parkingLotId;
    private String parkingLotName;
    private String parkingLotAddress;
    private String plateNumber;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private BigDecimal priceEstimated;
    private String currency;
    private LocalDateTime reservedAt;
    private LocalDateTime expiresAt;

    public Integer getReservationId() { return reservationId; }
    public void setReservationId(Integer reservationId) { this.reservationId = reservationId; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getVehicleId() { return vehicleId; }
    public void setVehicleId(Integer vehicleId) { this.vehicleId = vehicleId; }

    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }

    public ReservationStatus getStatus() { return status; }
    public void setStatus(ReservationStatus status) { this.status = status; }

    public Integer getParkingLotId() { return parkingLotId; }
    public void setParkingLotId(Integer parkingLotId) { this.parkingLotId = parkingLotId; }

    public String getParkingLotName() { return parkingLotName; }
    public void setParkingLotName(String parkingLotName) { this.parkingLotName = parkingLotName; }

    public String getParkingLotAddress() { return parkingLotAddress; }
    public void setParkingLotAddress(String parkingLotAddress) { this.parkingLotAddress = parkingLotAddress; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public BigDecimal getPriceEstimated() { return priceEstimated; }
    public void setPriceEstimated(BigDecimal priceEstimated) { this.priceEstimated = priceEstimated; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDateTime getReservedAt() { return reservedAt; }
    public void setReservedAt(LocalDateTime reservedAt) { this.reservedAt = reservedAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public static ReservationResponseDTO fromEntity(Reservation reservation) {
        if (reservation == null) {
            return null;
        }
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setReservationId(reservation.getReservationId());
        dto.setCustomerId(reservation.getCustomer() != null ? reservation.getCustomer().getCustomerId() : null);
        dto.setVehicleId(reservation.getVehicle() != null ? reservation.getVehicle().getVehicleId() : null);
        dto.setReservationCode(reservation.getReservationCode());
        dto.setStatus(reservation.getStatus());
        dto.setParkingLotId(reservation.getParkingLot() != null ? reservation.getParkingLot().getParkingLotId() : null);
        dto.setParkingLotName(reservation.getParkingLot() != null ? reservation.getParkingLot().getName() : null);
        dto.setParkingLotAddress(reservation.getParkingLot() != null ? reservation.getParkingLot().getAddress() : null);
        dto.setPlateNumber(reservation.getVehicle() != null ? reservation.getVehicle().getPlateNumber() : null);
        dto.setStartAt(reservation.getStartAt());
        dto.setEndAt(reservation.getEndAt());
        dto.setPriceEstimated(reservation.getPriceEstimated());
        dto.setCurrency(reservation.getPricingPlan() != null ? reservation.getPricingPlan().getCurrency() : null);
        dto.setReservedAt(reservation.getReservedAt());
        dto.setExpiresAt(reservation.getExpiresAt());
        return dto;
    }
}

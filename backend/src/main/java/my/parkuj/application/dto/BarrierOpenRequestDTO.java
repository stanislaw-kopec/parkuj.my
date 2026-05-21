package my.parkuj.application.dto;

// Żądanie otwarcia bramy z kodem rezerwacji
public class BarrierOpenRequestDTO {
    private String reservationCode;
    private Integer gateId;

    public String getReservationCode() { return reservationCode; }
    public void setReservationCode(String reservationCode) { this.reservationCode = reservationCode; }

    public Integer getGateId() { return gateId; }
    public void setGateId(Integer gateId) { this.gateId = gateId; }
}


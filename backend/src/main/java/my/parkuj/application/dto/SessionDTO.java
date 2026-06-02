package my.parkuj.application.dto;

import java.time.LocalDateTime;
import my.parkuj.application.enums.ParkingSessionStatus;
import my.parkuj.application.model.ParkingSession;

public class SessionDTO {
    private Integer sessionId;
    private String entryPlateNumber;
    private LocalDateTime entryAt;
    private ParkingSessionStatus status;
    private String parkingLotName;

    public Integer getSessionId() { return sessionId; }
    public void setSessionId(Integer sessionId) { this.sessionId = sessionId; }

    public String getEntryPlateNumber() { return entryPlateNumber; }
    public void setEntryPlateNumber(String entryPlateNumber) { this.entryPlateNumber = entryPlateNumber; }

    public LocalDateTime getEntryAt() { return entryAt; }
    public void setEntryAt(LocalDateTime entryAt) { this.entryAt = entryAt; }

    public ParkingSessionStatus getStatus() { return status; }
    public void setStatus(ParkingSessionStatus status) { this.status = status; }

    public String getParkingLotName() { return parkingLotName; }
    public void setParkingLotName(String parkingLotName) { this.parkingLotName = parkingLotName; }

    public static SessionDTO fromEntity(ParkingSession session) {
        if (session == null) return null;
        SessionDTO dto = new SessionDTO();
        dto.sessionId = session.getParkingSessionId();
        dto.entryPlateNumber = session.getEntryPlateNumber();
        dto.entryAt = session.getEntryAt();
        dto.status = session.getStatus();
        dto.parkingLotName = session.getParkingLot() != null ? session.getParkingLot().getName() : null;
        return dto;
    }
}


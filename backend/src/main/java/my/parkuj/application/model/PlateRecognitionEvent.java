package my.parkuj.application.model;

import jakarta.persistence.*;
import my.parkuj.application.enums.PlateRecognitionResult;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "plate_recognition_events")
public class PlateRecognitionEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_session_id")
    private ParkingSession parkingSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barrier_gate_id", nullable = false)
    private BarrierGate barrierGate;

    @Column(nullable = false)
    private String plateNumber;

    @Column(precision = 5, scale = 2)
    private BigDecimal confidence;

    @Column(nullable = false)
    private LocalDateTime capturedAt;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private PlateRecognitionResult result;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public ParkingSession getParkingSession() { return parkingSession; }
    public void setParkingSession(ParkingSession parkingSession) { this.parkingSession = parkingSession; }

    public BarrierGate getBarrierGate() { return barrierGate; }
    public void setBarrierGate(BarrierGate barrierGate) { this.barrierGate = barrierGate; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public BigDecimal getConfidence() { return confidence; }
    public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }

    public LocalDateTime getCapturedAt() { return capturedAt; }
    public void setCapturedAt(LocalDateTime capturedAt) { this.capturedAt = capturedAt; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public PlateRecognitionResult getResult() { return result; }
    public void setResult(PlateRecognitionResult result) { this.result = result; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


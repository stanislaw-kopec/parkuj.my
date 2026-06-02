package my.parkuj.application.model;

import jakarta.persistence.*;
import my.parkuj.application.enums.ParkingSessionStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "parking_sessions")
public class ParkingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parking_session_id")
    private Integer parkingSessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_lot_id", nullable = false)
    private ParkingLot parkingLot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barrier_gate_id")
    private BarrierGate barrierGate;

    @Column(nullable = false)
    private LocalDateTime entryAt;

    private LocalDateTime exitAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParkingSessionStatus status = ParkingSessionStatus.ACTIVE;

    @Column(nullable = false)
    private String entryPlateNumber;

    private String exitPlateNumber;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Integer getParkingSessionId() { return parkingSessionId; }
    public void setParkingSessionId(Integer parkingSessionId) { this.parkingSessionId = parkingSessionId; }

    public ParkingLot getParkingLot() { return parkingLot; }
    public void setParkingLot(ParkingLot parkingLot) { this.parkingLot = parkingLot; }

    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }

    public BarrierGate getBarrierGate() { return barrierGate; }
    public void setBarrierGate(BarrierGate barrierGate) { this.barrierGate = barrierGate; }

    public LocalDateTime getEntryAt() { return entryAt; }
    public void setEntryAt(LocalDateTime entryAt) { this.entryAt = entryAt; }

    public LocalDateTime getExitAt() { return exitAt; }
    public void setExitAt(LocalDateTime exitAt) { this.exitAt = exitAt; }

    public ParkingSessionStatus getStatus() { return status; }
    public void setStatus(ParkingSessionStatus status) { this.status = status; }

    public String getEntryPlateNumber() { return entryPlateNumber; }
    public void setEntryPlateNumber(String entryPlateNumber) { this.entryPlateNumber = entryPlateNumber; }

    public String getExitPlateNumber() { return exitPlateNumber; }
    public void setExitPlateNumber(String exitPlateNumber) { this.exitPlateNumber = exitPlateNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


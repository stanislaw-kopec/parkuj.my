package my.parkuj.application.model;

import jakarta.persistence.*;
import my.parkuj.application.enums.BarrierDirection;
import java.time.LocalDateTime;

@Entity
@Table(name = "barrier_gates")
public class BarrierGate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barrier_gate_id")
    private Integer barrierGateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_lot_id", nullable = false)
    private ParkingLot parkingLot;

    @Column(nullable = false)
    private String gateName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BarrierDirection direction;

    private String status;

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

    public Integer getBarrierGateId() { return barrierGateId; }
    public void setBarrierGateId(Integer barrierGateId) { this.barrierGateId = barrierGateId; }

    public ParkingLot getParkingLot() { return parkingLot; }
    public void setParkingLot(ParkingLot parkingLot) { this.parkingLot = parkingLot; }

    public String getGateName() { return gateName; }
    public void setGateName(String gateName) { this.gateName = gateName; }

    public BarrierDirection getDirection() { return direction; }
    public void setDirection(BarrierDirection direction) { this.direction = direction; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


package my.parkuj.application.model;

import jakarta.persistence.*;
import my.parkuj.application.enums.BarrierActionType;
import java.time.LocalDateTime;

@Entity
@Table(name = "barrier_actions")
public class BarrierAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "barrier_action_id")
    private Integer barrierActionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barrier_gate_id", nullable = false)
    private BarrierGate barrierGate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_session_id")
    private ParkingSession parkingSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id")
    private AdminUser adminUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BarrierActionType actionType;

    private String reason;

    private String actionResult;

    @Column(nullable = false)
    private LocalDateTime requestedAt;

    private LocalDateTime executedAt;

    public Integer getBarrierActionId() { return barrierActionId; }
    public void setBarrierActionId(Integer barrierActionId) { this.barrierActionId = barrierActionId; }

    public BarrierGate getBarrierGate() { return barrierGate; }
    public void setBarrierGate(BarrierGate barrierGate) { this.barrierGate = barrierGate; }

    public ParkingSession getParkingSession() { return parkingSession; }
    public void setParkingSession(ParkingSession parkingSession) { this.parkingSession = parkingSession; }

    public AdminUser getAdminUser() { return adminUser; }
    public void setAdminUser(AdminUser adminUser) { this.adminUser = adminUser; }

    public BarrierActionType getActionType() { return actionType; }
    public void setActionType(BarrierActionType actionType) { this.actionType = actionType; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getActionResult() { return actionResult; }
    public void setActionResult(String actionResult) { this.actionResult = actionResult; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }
}


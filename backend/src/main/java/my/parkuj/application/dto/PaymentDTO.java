package my.parkuj.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import my.parkuj.application.enums.PaymentMethod;
import my.parkuj.application.enums.PaymentStatus;
import my.parkuj.application.model.Payment;

public class PaymentDTO {
    private Integer paymentId;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime paidAt;

    public Integer getPaymentId() { return paymentId; }
    public void setPaymentId(Integer paymentId) { this.paymentId = paymentId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public static PaymentDTO fromEntity(Payment payment) {
        if (payment == null) return null;
        PaymentDTO dto = new PaymentDTO();
        dto.paymentId = payment.getPaymentId();
        dto.amount = payment.getAmount();
        dto.currency = payment.getCurrency();
        dto.method = payment.getPaymentMethod();
        dto.status = payment.getStatus();
        dto.paidAt = payment.getPaidAt();
        return dto;
    }
}


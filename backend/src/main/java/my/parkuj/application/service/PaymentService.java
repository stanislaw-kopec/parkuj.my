package my.parkuj.application.service;

import java.time.LocalDateTime;
import my.parkuj.application.dto.PaymentDTO;
import my.parkuj.application.dto.ReservationResponseDTO;
import my.parkuj.application.enums.PaymentMethod;
import my.parkuj.application.enums.PaymentStatus;
import my.parkuj.application.model.Payment;
import my.parkuj.application.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationService reservationService;

    public PaymentService(PaymentRepository paymentRepository, ReservationService reservationService) {
        this.paymentRepository = paymentRepository;
        this.reservationService = reservationService;
    }

    @Transactional
    public PaymentDTO payForReservation(Integer reservationId, PaymentMethod method) {
        // confirmReservation już tworzy rekord Payment (status=COMPLETED) — tu
        // tylko zwracamy zamapowane dane bez zapisu duplikatu.
        ReservationResponseDTO reservation = reservationService.confirmReservation(
            reservationId, "MOCK_PAYMENT", method != null ? method.name() : null
        );

        PaymentDTO dto = new PaymentDTO();
        dto.setReservationId(reservationId);
        dto.setAmount(reservation.getPriceEstimated());
        dto.setCurrency(reservation.getCurrency());
        dto.setMethod(method);
        dto.setStatus(PaymentStatus.COMPLETED);
        dto.setPaidAt(LocalDateTime.now());
        return dto;
    }
}


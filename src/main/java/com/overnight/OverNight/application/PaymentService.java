package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.Payment;
import com.overnight.OverNight.domain.Reservation;
import com.overnight.OverNight.domain.Reservation;
import com.overnight.OverNight.infrastructure.PaymentRepo;
import com.overnight.OverNight.infrastructure.ReservationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepo paymentRepo;
    private final ReservationRepo reservationRepo;

    @Transactional
    public Payment createPayment(Payment payment) {
        if (payment.getReservation() != null && payment.getReservation().getId() != null) {
            Reservation reservation = reservationRepo.findByIdAndDeletedAtIsNull(payment.getReservation().getId())
                    .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + payment.getReservation().getId()));
            payment.setReservation(reservation);

            if (payment.getUser() == null) {
                payment.setUser(reservation.getUser());
            }
        }

        if (payment.getTransactionId() == null) {
            payment.setTransactionId("TXN-" + System.currentTimeMillis());
        }

        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDate.now().toString());
        }
        if (payment.getPaymentTime() == null) {
            payment.setPaymentTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        }

        if (payment.getStatus() == null) {
            payment.setStatus("PENDING");
        }

        payment.setIsActive(true);
        Payment savedPayment = paymentRepo.save(payment);

        if ("COMPLETED".equals(payment.getStatus()) && payment.getReservation() != null) {
            Reservation reservation = payment.getReservation();
            reservation.setStatus("ACTIVE");
            reservationRepo.save(reservation);
        }

        return savedPayment;
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public Payment getPaymentById(Long id) {
        return paymentRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepo.findByTransactionIdAndDeletedAtIsNull(transactionId)
                .orElseThrow(() -> new RuntimeException("Payment not found with transaction: " + transactionId));
    }

    @Transactional(readOnly = true)
    public Payment getPaymentByReservationId(Long reservationId) {
        return paymentRepo.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Payment not found for reservation: " + reservationId));
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepo.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepo.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Payment> getPaymentsByMethod(String method) {
        return paymentRepo.findByMethod(method);
    }

    @Transactional
    public Payment updatePayment(Long id, Payment updatedPayment) {
        Payment payment = getPaymentById(id);

        if (updatedPayment.getAmount() != null) {
            payment.setAmount(updatedPayment.getAmount());
        }
        if (updatedPayment.getMethod() != null) {
            payment.setMethod(updatedPayment.getMethod());
        }
        if (updatedPayment.getStatus() != null) {
            payment.setStatus(updatedPayment.getStatus());
        }
        if (updatedPayment.getCardNumber() != null) {
            payment.setCardNumber(updatedPayment.getCardNumber());
        }
        if (updatedPayment.getPaymentDate() != null) {
            payment.setPaymentDate(updatedPayment.getPaymentDate());
        }
        if (updatedPayment.getPaymentTime() != null) {
            payment.setPaymentTime(updatedPayment.getPaymentTime());
        }

        Payment savedPayment = paymentRepo.save(payment);

        if ("COMPLETED".equals(updatedPayment.getStatus()) && payment.getReservation() != null) {
            Reservation reservation = payment.getReservation();
            reservation.setStatus("ACTIVE");
            reservationRepo.save(reservation);
        }

        return savedPayment;
    }

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = getPaymentById(id);
        payment.setDeletedAt(java.time.LocalDateTime.now());
        payment.setIsActive(false);
        paymentRepo.save(payment);
    }

    @Transactional
    public Payment completePayment(Long id) {
        Payment payment = getPaymentById(id);
        payment.setStatus("COMPLETED");
        payment.setPaymentDate(LocalDate.now().toString());
        payment.setPaymentTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

        Payment savedPayment = paymentRepo.save(payment);

        if (payment.getReservation() != null) {
            Reservation reservation = payment.getReservation();
            reservation.setStatus("ACTIVE");
            reservationRepo.save(reservation);
        }

        return savedPayment;
    }

    @Transactional
    public Payment failPayment(Long id) {
        Payment payment = getPaymentById(id);
        payment.setStatus("FAILED");
        return paymentRepo.save(payment);
    }

    @Transactional
    public Payment refundPayment(Long id) {
        Payment payment = getPaymentById(id);
        payment.setStatus("REFUNDED");

        if (payment.getReservation() != null) {
            Reservation reservation = payment.getReservation();
            reservation.setStatus("CANCELLED");
            reservationRepo.save(reservation);
        }

        return paymentRepo.save(payment);
    }

    @Transactional(readOnly = true)
    public Double getTotalRevenue() {
        Double revenue = paymentRepo.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    @Transactional(readOnly = true)
    public Double getPendingAmount() {
        Double pending = paymentRepo.getPendingAmount();
        return pending != null ? pending : 0.0;
    }

    @Transactional(readOnly = true)
    public Long getPendingCount() {
        Long count = paymentRepo.getPendingCount();
        return count != null ? count : 0L;
    }

    @Transactional(readOnly = true)
    public Double getRevenueFromDate(String startDate) {
        Double revenue = paymentRepo.getRevenueFromDate(startDate);
        return revenue != null ? revenue : 0.0;
    }

    @Transactional(readOnly = true)
    public Double getThisMonthRevenue() {
        String startDate = LocalDate.now().withDayOfMonth(1).toString();
        return getRevenueFromDate(startDate);
    }
}
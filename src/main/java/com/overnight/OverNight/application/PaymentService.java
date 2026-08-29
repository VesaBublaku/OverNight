package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.Payment;
import com.overnight.OverNight.domain.Reservation;
import com.overnight.OverNight.infrastructure.PaymentRepo;
import com.overnight.OverNight.infrastructure.ReservationRepo;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public Map<String, String> createStripePaymentIntent(Long reservationId, Double amount, String currency) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (amount * 100))
                .setCurrency(currency != null ? currency : "usd")
                .setDescription("Reservation #" + reservationId)
                .putMetadata("reservationId", String.valueOf(reservationId))
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("paymentIntentId", paymentIntent.getId());

        return response;
    }

    @Transactional
    public Payment confirmStripePayment(String paymentIntentId, Long reservationId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

        if (!"succeeded".equals(paymentIntent.getStatus())) {
            throw new RuntimeException("Payment not successful. Status: " + paymentIntent.getStatus());
        }

        Reservation reservation = reservationRepo.findByIdAndDeletedAtIsNull(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + reservationId));

        Payment existingPayment = paymentRepo.findByReservationId(reservationId).orElse(null);
        if (existingPayment != null) {
            existingPayment.setStatus("COMPLETED");
            existingPayment.setTransactionId(paymentIntentId);
            existingPayment.setPaymentDate(LocalDate.now().toString());
            existingPayment.setPaymentTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
            existingPayment.setMethod("STRIPE");
            existingPayment.setAmount(reservation.getTotalPrice());

            Payment savedPayment = paymentRepo.save(existingPayment);

            reservation.setStatus("ACTIVE");
            reservationRepo.save(reservation);

            return savedPayment;
        }

        Payment payment = new Payment();
        payment.setTransactionId(paymentIntentId);
        payment.setReservation(reservation);
        payment.setUser(reservation.getUser());
        payment.setAmount(reservation.getTotalPrice());
        payment.setMethod("STRIPE");
        payment.setStatus("COMPLETED");
        payment.setPaymentDate(LocalDate.now().toString());
        payment.setPaymentTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        payment.setIsActive(true);

        Payment savedPayment = paymentRepo.save(payment);

        reservation.setStatus("ACTIVE");
        reservationRepo.save(reservation);

        return savedPayment;
    }

    public PaymentIntent getStripePaymentIntent(String paymentIntentId) throws StripeException {
        return PaymentIntent.retrieve(paymentIntentId);
    }

    public PaymentIntent cancelStripePaymentIntent(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return paymentIntent.cancel();
    }

    @Transactional
    public Payment processPayAtHotel(Long reservationId) {
        Reservation reservation = reservationRepo.findByIdAndDeletedAtIsNull(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + reservationId));

        Payment payment = new Payment();
        payment.setTransactionId("HOTEL-" + System.currentTimeMillis());
        payment.setReservation(reservation);
        payment.setUser(reservation.getUser());
        payment.setAmount(reservation.getTotalPrice());
        payment.setMethod("HOTEL");
        payment.setStatus("PENDING");
        payment.setPaymentDate(LocalDate.now().toString());
        payment.setPaymentTime(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        payment.setIsActive(true);

        return paymentRepo.save(payment);
    }

    public Payment getPaymentByStripeIntentId(String paymentIntentId) {
        return getPaymentByTransactionId(paymentIntentId);
    }

}
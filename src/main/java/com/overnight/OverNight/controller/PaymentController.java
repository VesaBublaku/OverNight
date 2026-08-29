package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.PaymentService;
import com.overnight.OverNight.domain.Payment;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.stripe.exception.StripeException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getPaymentByTransactionId(@PathVariable String transactionId) {
        return ResponseEntity.ok(paymentService.getPaymentByTransactionId(transactionId));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<Payment> getPaymentByReservationId(@PathVariable Long reservationId) {
        return ResponseEntity.ok(paymentService.getPaymentByReservationId(reservationId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getPaymentsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentService.getPaymentsByUser(userId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(paymentService.getPaymentsByStatus(status));
    }

    @GetMapping("/method/{method}")
    public ResponseEntity<List<Payment>> getPaymentsByMethod(@PathVariable String method) {
        return ResponseEntity.ok(paymentService.getPaymentsByMethod(method));
    }

    @GetMapping("/stats/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", paymentService.getTotalRevenue());
        stats.put("pendingAmount", paymentService.getPendingAmount());
        stats.put("pendingCount", paymentService.getPendingCount());
        stats.put("thisMonthRevenue", paymentService.getThisMonthRevenue());
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Payment created = paymentService.createPayment(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Long id,
            @RequestBody Payment payment) {
        Payment updated = paymentService.updatePayment(id, payment);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Payment> completePayment(@PathVariable Long id) {
        Payment completed = paymentService.completePayment(id);
        return ResponseEntity.ok(completed);
    }

    @PutMapping("/{id}/fail")
    public ResponseEntity<Payment> failPayment(@PathVariable Long id) {
        Payment failed = paymentService.failPayment(id);
        return ResponseEntity.ok(failed);
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<Payment> refundPayment(@PathVariable Long id) {
        Payment refunded = paymentService.refundPayment(id);
        return ResponseEntity.ok(refunded);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Payment deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
            @RequestBody Map<String, Object> request) throws StripeException {

        Long reservationId = Long.valueOf(request.get("reservationId").toString());
        Double amount = Double.valueOf(request.get("amount").toString());
        String currency = request.get("currency") != null ? request.get("currency").toString() : "usd";

        Map<String, String> response = paymentService.createStripePaymentIntent(reservationId, amount, currency);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm/{paymentIntentId}")
    public ResponseEntity<Payment> confirmPayment(
            @PathVariable String paymentIntentId,
            @RequestBody Map<String, Object> request) throws StripeException {

        Long reservationId = Long.valueOf(request.get("reservationId").toString());
        Payment payment = paymentService.confirmStripePayment(paymentIntentId, reservationId);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/status/{paymentIntentId}")
    public ResponseEntity<Map<String, String>> getPaymentStatus(
            @PathVariable String paymentIntentId) throws StripeException {

        var paymentIntent = paymentService.getStripePaymentIntent(paymentIntentId);

        Map<String, String> response = new HashMap<>();
        response.put("status", paymentIntent.getStatus());
        response.put("paymentIntentId", paymentIntent.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel/{paymentIntentId}")
    public ResponseEntity<Map<String, String>> cancelPaymentIntent(
            @PathVariable String paymentIntentId) throws StripeException {

        var paymentIntent = paymentService.cancelStripePaymentIntent(paymentIntentId);

        Map<String, String> response = new HashMap<>();
        response.put("status", paymentIntent.getStatus());
        response.put("paymentIntentId", paymentIntent.getId());

        return ResponseEntity.ok(response);
    }
}
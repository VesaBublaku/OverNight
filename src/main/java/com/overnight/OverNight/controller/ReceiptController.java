package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.ReceiptService;
import com.overnight.OverNight.domain.Receipt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = {"http://localhost:4300", "http://localhost:4200"})
@RequiredArgsConstructor
public class ReceiptController {

    private final ReceiptService receiptService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Receipt>> getAllReceipts() {
        return ResponseEntity.ok(receiptService.getAllReceipts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receipt> getReceiptById(@PathVariable Long id) {
        return ResponseEntity.ok(receiptService.getReceiptById(id));
    }

    @GetMapping("/number/{receiptNumber}")
    public ResponseEntity<Receipt> getReceiptByNumber(@PathVariable String receiptNumber) {
        return ResponseEntity.ok(receiptService.getReceiptByNumber(receiptNumber));
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Receipt> getReceiptByTransactionId(@PathVariable String transactionId) {
        return ResponseEntity.ok(receiptService.getReceiptByTransactionId(transactionId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Receipt>> getReceiptsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(receiptService.getReceiptsByUser(userId));
    }

    @GetMapping("/payment/{paymentId}")
    public ResponseEntity<Receipt> getReceiptByPayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(receiptService.getReceiptByPayment(paymentId));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<Receipt> getReceiptByReservation(@PathVariable Long reservationId) {
        return ResponseEntity.ok(receiptService.getReceiptByReservation(reservationId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<Receipt>> getReceiptsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(receiptService.getReceiptsByStatus(status));
    }

    @GetMapping("/customer/email/{email}")
    public ResponseEntity<List<Receipt>> getReceiptsByCustomerEmail(@PathVariable String email) {
        return ResponseEntity.ok(receiptService.getReceiptsByCustomerEmail(email));
    }

    @PostMapping("/generate/payment/{paymentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Receipt> generateReceiptFromPayment(@PathVariable Long paymentId) {
        Receipt receipt = receiptService.generateReceiptFromPayment(paymentId);
        return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
    }

    @PostMapping("/generate/reservation/{reservationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Receipt> generateReceiptFromReservation(@PathVariable Long reservationId) {
        Receipt receipt = receiptService.generateReceiptFromReservation(reservationId);
        return ResponseEntity.status(HttpStatus.CREATED).body(receipt);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Receipt> updateReceipt(
            @PathVariable Long id,
            @RequestBody Receipt receipt) {
        Receipt updated = receiptService.updateReceipt(id, receipt);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Receipt deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/count/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Map<String, Long>> countReceiptsByStatus(@PathVariable String status) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", receiptService.countReceiptsByStatus(status));
        return ResponseEntity.ok(response);
    }
}
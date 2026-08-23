package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.*;
import com.overnight.OverNight.infrastructure.ReceiptRepo;
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
public class ReceiptService {

    private final ReceiptRepo receiptRepo;
    private final PaymentRepo paymentRepo;
    private final ReservationRepo reservationRepo;

    @Transactional
    public Receipt generateReceiptFromPayment(Long paymentId) {
        Payment payment = paymentRepo.findByIdAndDeletedAtIsNull(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));

        Reservation reservation = payment.getReservation();
        User user = payment.getUser();

        Receipt receipt = new Receipt();
        receipt.setReceiptNumber("RCP-" + System.currentTimeMillis());
        receipt.setPayment(payment);
        receipt.setReservation(reservation);
        receipt.setUser(user);

        receipt.setCustomerName(user != null ? user.getFullName() : "Guest");
        receipt.setCustomerEmail(user != null ? user.getEmail() : null);

        if (reservation != null && reservation.getRoom() != null && reservation.getRoom().getHotel() != null) {
            Hotel hotel = reservation.getRoom().getHotel();
            receipt.setHotelName(hotel.getName());
            receipt.setRoomNumber(reservation.getRoom().getRoomNumber());
        }

        receipt.setPaymentMethod(payment.getMethod());
        receipt.setPaymentDate(payment.getPaymentDate());
        receipt.setPaymentTime(payment.getPaymentTime());
        receipt.setTransactionId(payment.getTransactionId());
        receipt.setAmount(payment.getAmount());
        receipt.setStatus(payment.getStatus());

        double taxRate = 0.10;
        double serviceFeeRate = 0.05;
        receipt.setTax(payment.getAmount() * taxRate);
        receipt.setServiceFee(payment.getAmount() * serviceFeeRate);
        receipt.setTotalAmount(payment.getAmount() + receipt.getTax() + receipt.getServiceFee());

        receipt.setIsActive(true);
        return receiptRepo.save(receipt);
    }

    @Transactional
    public Receipt generateReceiptFromReservation(Long reservationId) {
        Reservation reservation = reservationRepo.findByIdAndDeletedAtIsNull(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + reservationId));

        User user = reservation.getUser();
        Payment payment = reservation.getPayment();

        Receipt receipt = new Receipt();
        receipt.setReceiptNumber("RCP-" + System.currentTimeMillis());
        receipt.setReservation(reservation);
        receipt.setUser(user);

        receipt.setCustomerName(user != null ? user.getFullName() : "Guest");
        receipt.setCustomerEmail(user != null ? user.getEmail() : null);

        receipt.setHotelName(reservation.getHotelName());
        receipt.setRoomNumber(reservation.getRoomNumber());

        if (payment != null) {
            receipt.setPayment(payment);
            receipt.setPaymentMethod(payment.getMethod());
            receipt.setPaymentDate(payment.getPaymentDate());
            receipt.setPaymentTime(payment.getPaymentTime());
            receipt.setTransactionId(payment.getTransactionId());
            receipt.setAmount(payment.getAmount());
            receipt.setStatus(payment.getStatus());

            double taxRate = 0.10;
            double serviceFeeRate = 0.05;
            receipt.setTax(payment.getAmount() * taxRate);
            receipt.setServiceFee(payment.getAmount() * serviceFeeRate);
            receipt.setTotalAmount(payment.getAmount() + receipt.getTax() + receipt.getServiceFee());
        } else {
            receipt.setAmount(reservation.getTotalPrice());
            receipt.setStatus("PENDING");

            double taxRate = 0.10;
            double serviceFeeRate = 0.05;
            receipt.setTax(reservation.getTotalPrice() * taxRate);
            receipt.setServiceFee(reservation.getTotalPrice() * serviceFeeRate);
            receipt.setTotalAmount(reservation.getTotalPrice() + receipt.getTax() + receipt.getServiceFee());
        }

        receipt.setIsActive(true);
        return receiptRepo.save(receipt);
    }

    @Transactional(readOnly = true)
    public List<Receipt> getAllReceipts() {
        return receiptRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptById(Long id) {
        return receiptRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptByNumber(String receiptNumber) {
        return receiptRepo.findByReceiptNumberAndDeletedAtIsNull(receiptNumber)
                .orElseThrow(() -> new RuntimeException("Receipt not found with number: " + receiptNumber));
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptByTransactionId(String transactionId) {
        return receiptRepo.findByTransactionIdAndDeletedAtIsNull(transactionId)
                .orElseThrow(() -> new RuntimeException("Receipt not found for transaction: " + transactionId));
    }

    @Transactional(readOnly = true)
    public List<Receipt> getReceiptsByUser(Long userId) {
        return receiptRepo.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptByPayment(Long paymentId) {
        return receiptRepo.findByPaymentId(paymentId)
                .orElseThrow(() -> new RuntimeException("Receipt not found for payment: " + paymentId));
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptByReservation(Long reservationId) {
        return receiptRepo.findByReservationId(reservationId)
                .orElseThrow(() -> new RuntimeException("Receipt not found for reservation: " + reservationId));
    }

    @Transactional(readOnly = true)
    public List<Receipt> getReceiptsByStatus(String status) {
        return receiptRepo.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<Receipt> getReceiptsByCustomerEmail(String email) {
        return receiptRepo.findByCustomerEmail(email);
    }

    @Transactional
    public Receipt updateReceipt(Long id, Receipt updatedReceipt) {
        Receipt receipt = getReceiptById(id);

        if (updatedReceipt.getStatus() != null) {
            receipt.setStatus(updatedReceipt.getStatus());
        }
        if (updatedReceipt.getAmount() != null) {
            receipt.setAmount(updatedReceipt.getAmount());
        }
        if (updatedReceipt.getTax() != null) {
            receipt.setTax(updatedReceipt.getTax());
        }
        if (updatedReceipt.getServiceFee() != null) {
            receipt.setServiceFee(updatedReceipt.getServiceFee());
        }
        if (updatedReceipt.getTotalAmount() != null) {
            receipt.setTotalAmount(updatedReceipt.getTotalAmount());
        }

        return receiptRepo.save(receipt);
    }

    @Transactional
    public void deleteReceipt(Long id) {
        Receipt receipt = getReceiptById(id);
        receipt.setDeletedAt(java.time.LocalDateTime.now());
        receipt.setIsActive(false);
        receiptRepo.save(receipt);
    }

    @Transactional(readOnly = true)
    public long countReceiptsByStatus(String status) {
        return receiptRepo.findByStatus(status).size();
    }
}
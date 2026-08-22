package com.overnight.OverNight.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "receipts")
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "receipt_number", unique = true, nullable = false)
    private String receiptNumber;

    @ManyToOne
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "hotel_name")
    private String hotelName;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "payment_date")
    private String paymentDate;

    @Column(name = "payment_time")
    private String paymentTime;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "tax")
    private Double tax;

    @Column(name = "service_fee")
    private Double serviceFee;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (receiptNumber == null) {
            receiptNumber = "RCP-" + System.currentTimeMillis();
        }
        if (paymentDate == null) {
            paymentDate = java.time.LocalDate.now().toString();
        }
        if (paymentTime == null) {
            paymentTime = java.time.LocalTime.now().format(
                    java.time.format.DateTimeFormatter.ofPattern("HH:mm")
            );
        }
    }

    public String getFormattedAmount() {
        return String.format("$%.2f", amount != null ? amount : 0);
    }

    public String getFormattedTotal() {
        return String.format("$%.2f", totalAmount != null ? totalAmount : 0);
    }

    public String getFormattedTax() {
        return String.format("$%.2f", tax != null ? tax : 0);
    }

    public String getFormattedServiceFee() {
        return String.format("$%.2f", serviceFee != null ? serviceFee : 0);
    }
}
package com.overnight.OverNight.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", unique = true, nullable = false)
    private String transactionId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "method")
    private String method;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "card_number")
    private String cardNumber;

    @Column(name = "payment_date")
    private String paymentDate;

    @Column(name = "payment_time")
    private String paymentTime;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (transactionId == null) {
            transactionId = "TXN-" + System.currentTimeMillis();
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

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Helper methods
    public String getCustomerName() {
        return user != null ? user.getFullName() : null;
    }

    public String getCustomerEmail() {
        return user != null ? user.getEmail() : null;
    }

    public String getHotelName() {
        return reservation != null && reservation.getRoom() != null && reservation.getRoom().getHotel() != null
                ? reservation.getRoom().getHotel().getName() : null;
    }

    public String getRoomNumber() {
        return reservation != null && reservation.getRoom() != null
                ? reservation.getRoom().getRoomNumber() : null;
    }

    public String getReservationNumber() {
        return reservation != null ? reservation.getReservationNumber() : null;
    }
}
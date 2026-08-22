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
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_number", unique = true, nullable = false)
    private String reservationNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "check_in_date", nullable = false)
    private String checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private String checkOutDate;

    @Column(nullable = false)
    private Integer nights;

    @Column(nullable = false)
    private Integer guests;

    @Column(nullable = false)
    private Double totalPrice;

    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "status")
    private String status = "UPCOMING";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @JsonIgnore
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (reservationNumber == null) {
            reservationNumber = "RES-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getHotelName() {
        return room != null && room.getHotel() != null ? room.getHotel().getName() : null;
    }

    public String getHotelCity() {
        return room != null && room.getHotel() != null ? room.getHotel().getCityName() : null;
    }

    public String getRoomNumber() {
        return room != null ? room.getRoomNumber() : null;
    }

    public String getUserName() {
        return user != null ? user.getFullName() : "Guest";
    }

    public String getUserEmail() {
        return user != null ? user.getEmail() : null;
    }

    public boolean hasPayment() {
        return payment != null;
    }

    public String getPaymentStatus() {
        return payment != null ? payment.getStatus() : "Not Paid";
    }
}
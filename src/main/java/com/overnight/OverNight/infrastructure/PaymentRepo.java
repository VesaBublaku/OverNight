package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {

    Optional<Payment> findByIdAndDeletedAtIsNull(Long id);

    Optional<Payment> findByTransactionIdAndDeletedAtIsNull(String transactionId);

    Optional<Payment> findByReservationIdAndDeletedAtIsNull(Long reservationId);

    @Query("SELECT p FROM Payment p WHERE p.deletedAt IS NULL")
    List<Payment> findAllActive();

    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId AND p.deletedAt IS NULL")
    List<Payment> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Payment p WHERE p.status = :status AND p.deletedAt IS NULL")
    List<Payment> findByStatus(@Param("status") String status);

    @Query("SELECT p FROM Payment p WHERE p.method = :method AND p.deletedAt IS NULL")
    List<Payment> findByMethod(@Param("method") String method);

    @Query("SELECT p FROM Payment p WHERE p.reservation.id = :reservationId AND p.deletedAt IS NULL")
    Optional<Payment> findByReservationId(@Param("reservationId") Long reservationId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.deletedAt IS NULL")
    Double getTotalRevenue();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'PENDING' AND p.deletedAt IS NULL")
    Double getPendingAmount();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'PENDING' AND p.deletedAt IS NULL")
    Long getPendingCount();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' AND p.paymentDate >= :startDate AND p.deletedAt IS NULL")
    Double getRevenueFromDate(@Param("startDate") String startDate);
}
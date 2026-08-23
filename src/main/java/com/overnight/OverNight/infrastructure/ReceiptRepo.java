package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepo extends JpaRepository<Receipt, Long> {

    Optional<Receipt> findByIdAndDeletedAtIsNull(Long id);

    Optional<Receipt> findByReceiptNumberAndDeletedAtIsNull(String receiptNumber);

    Optional<Receipt> findByTransactionIdAndDeletedAtIsNull(String transactionId);

    @Query("SELECT r FROM Receipt r WHERE r.deletedAt IS NULL")
    List<Receipt> findAllActive();

    @Query("SELECT r FROM Receipt r WHERE r.user.id = :userId AND r.deletedAt IS NULL")
    List<Receipt> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Receipt r WHERE r.payment.id = :paymentId AND r.deletedAt IS NULL")
    Optional<Receipt> findByPaymentId(@Param("paymentId") Long paymentId);

    @Query("SELECT r FROM Receipt r WHERE r.reservation.id = :reservationId AND r.deletedAt IS NULL")
    Optional<Receipt> findByReservationId(@Param("reservationId") Long reservationId);

    @Query("SELECT r FROM Receipt r WHERE r.status = :status AND r.deletedAt IS NULL")
    List<Receipt> findByStatus(@Param("status") String status);

    @Query("SELECT r FROM Receipt r WHERE r.customerEmail = :email AND r.deletedAt IS NULL")
    List<Receipt> findByCustomerEmail(@Param("email") String email);
}
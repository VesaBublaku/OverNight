package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepo extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByIdAndDeletedAtIsNull(Long id);

    Optional<Reservation> findByReservationNumberAndDeletedAtIsNull(String reservationNumber);

    @Query("SELECT r FROM Reservation r WHERE r.deletedAt IS NULL")
    List<Reservation> findAllActive();

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.deletedAt IS NULL")
    List<Reservation> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.deletedAt IS NULL")
    List<Reservation> findByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT r FROM Reservation r WHERE r.status = :status AND r.deletedAt IS NULL")
    List<Reservation> findByStatus(@Param("status") String status);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.status = :status AND r.deletedAt IS NULL")
    List<Reservation> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status);

    @Query("SELECT r FROM Reservation r WHERE r.checkInDate >= :startDate AND r.deletedAt IS NULL ORDER BY r.checkInDate ASC")
    List<Reservation> findUpcomingReservations(@Param("startDate") String startDate);

    @Query("SELECT r FROM Reservation r WHERE r.checkOutDate < :endDate AND r.deletedAt IS NULL ORDER BY r.checkOutDate DESC")
    List<Reservation> findPastReservations(@Param("endDate") String endDate);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.checkInDate >= :startDate AND r.deletedAt IS NULL ORDER BY r.checkInDate ASC")
    List<Reservation> findUpcomingByUser(@Param("userId") Long userId, @Param("startDate") String startDate);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.checkOutDate < :endDate AND r.deletedAt IS NULL ORDER BY r.checkOutDate DESC")
    List<Reservation> findPastByUser(@Param("userId") Long userId, @Param("endDate") String endDate);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.room.id = :roomId AND r.status != 'CANCELLED' AND r.deletedAt IS NULL")
    Long countActiveByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT SUM(r.totalPrice) FROM Reservation r WHERE r.status = 'COMPLETED' AND r.deletedAt IS NULL")
    Double getTotalRevenue();

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.room.id = :roomId " +
            "AND r.isActive = true " +
            "AND r.status != 'CANCELLED' " +
            "AND r.status != 'COMPLETED' " +
            "AND ((r.checkInDate <= :checkOut AND r.checkOutDate >= :checkIn))")
    long countOverlappingReservations(@Param("roomId") Long roomId,
                                      @Param("checkIn") String checkIn,
                                      @Param("checkOut") String checkOut);

    @Query("SELECT DISTINCT r.checkInDate FROM Reservation r " +
            "WHERE r.room.id = :roomId " +
            "AND r.isActive = true " +
            "AND r.status != 'CANCELLED' " +
            "AND r.status != 'COMPLETED' " +
            "AND r.checkInDate >= :today")
    List<String> findUnavailableDates(@Param("roomId") Long roomId,
                                      @Param("today") String today);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.user.id = :userId AND r.status = 'COMPLETED' AND r.deletedAt IS NULL")
    Integer countCompletedReservationsByUserId(@Param("userId") Long userId);
}
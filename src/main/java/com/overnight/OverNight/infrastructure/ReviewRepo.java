package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
    List<Review> findByReservationId(Long reservationId);

    @Query("SELECT r FROM Review r WHERE r.reservation.room.hotel.id = :hotelId")
    List<Review> findByHotelId(@Param("hotelId") Long hotelId);
}

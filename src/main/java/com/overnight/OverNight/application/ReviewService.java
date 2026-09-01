package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.Reservation;
import com.overnight.OverNight.domain.Review;
import com.overnight.OverNight.infrastructure.ReviewRepo;
import com.overnight.OverNight.infrastructure.ReservationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepo reviewRepo;
    private final ReservationRepo reservationRepo;

    @Transactional
    public Review createReview(Long reservationId, Review review) {
        Reservation reservation = reservationRepo.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + reservationId));

        review.setReservation(reservation);
        review.setUser(reservation.getUser());
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepo.save(review);
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByReservation(Long reservationId) {
        return reviewRepo.findByReservationId(reservationId);
    }

    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    @Transactional
    public void deleteReview(Long id) {
        if (!reviewRepo.existsById(id)) {
            throw new RuntimeException("Review not found with id: " + id);
        }
        reviewRepo.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByHotel(Long hotelId) {
        return reviewRepo.findByHotelId(hotelId);
    }
}
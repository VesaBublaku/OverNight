package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.ReviewService;
import com.overnight.OverNight.domain.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/reservation/{reservationId}")
    public ResponseEntity<Review> createReview(@PathVariable Long reservationId, @RequestBody Review review) {
        Review created = reviewService.createReview(reservationId, review);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<Review>> getReviewsByReservation(@PathVariable Long reservationId) {
        return ResponseEntity.ok(reviewService.getReviewsByReservation(reservationId));
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Review>> getReviewsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reviewService.getReviewsByHotel(hotelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Review deleted successfully");
        return ResponseEntity.ok(response);
    }
}
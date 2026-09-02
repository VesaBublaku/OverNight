package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.ReservationService;
import com.overnight.OverNight.domain.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<Reservation> getReservationByNumber(@PathVariable String number) {
        return ResponseEntity.ok(reservationService.getReservationByNumber(number));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<Reservation>> getUpcomingReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getUpcomingReservationsByUser(userId));
    }

    @GetMapping("/user/{userId}/past")
    public ResponseEntity<List<Reservation>> getPastReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getPastReservationsByUser(userId));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Reservation>> getReservationsByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(reservationService.getReservationsByRoom(roomId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Reservation>> getReservationsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(reservationService.getReservationsByStatus(status));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Reservation>> getUpcomingReservations() {
        return ResponseEntity.ok(reservationService.getUpcomingReservations());
    }

    @GetMapping("/past")
    public ResponseEntity<List<Reservation>> getPastReservations() {
        return ResponseEntity.ok(reservationService.getPastReservations());
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        Reservation created = reservationService.createReservation(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @RequestBody Reservation reservation) {
        Reservation updated = reservationService.updateReservation(id, reservation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Reservation deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        Reservation cancelled = reservationService.cancelReservation(id);
        return ResponseEntity.ok(cancelled);
    }

    @PutMapping("/{id}/check-in")
    public ResponseEntity<Reservation> checkIn(@PathVariable Long id) {
        Reservation checkedIn = reservationService.checkIn(id);
        return ResponseEntity.ok(checkedIn);
    }

    @PutMapping("/{id}/check-out")
    public ResponseEntity<Reservation> checkOut(@PathVariable Long id) {
        Reservation checkedOut = reservationService.checkOut(id);
        return ResponseEntity.ok(checkedOut);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Reservation> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Reservation updated = reservationService.updateStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/stats/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", reservationService.getTotalRevenue());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/room/{roomId}")
    public ResponseEntity<Map<String, Long>> countActiveByRoom(@PathVariable Long roomId) {
        Map<String, Long> response = new HashMap<>();
        response.put("activeReservations", reservationService.countActiveByRoom(roomId));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut
    ) {
        boolean available = reservationService.isRoomAvailable(roomId, checkIn, checkOut);
        return ResponseEntity.ok(available);
    }

    @GetMapping("/unavailable-dates/{roomId}")
    public ResponseEntity<List<String>> getUnavailableDates(@PathVariable Long roomId) {
        List<String> dates = reservationService.getUnavailableDates(roomId);
        return ResponseEntity.ok(dates);
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Reservation> confirmReservation(@PathVariable Long id) {
        Reservation confirmed = reservationService.confirmReservation(id);
        return ResponseEntity.ok(confirmed);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<?> completeReservation(@PathVariable Long id) {
        try {
            Reservation completed = reservationService.completeReservation(id);
            return ResponseEntity.ok(completed);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("already completed")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", e.getMessage());
                return ResponseEntity.status(409).body(error);
            }
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        }
    }
}
package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.*;
import com.overnight.OverNight.infrastructure.ReservationRepo;
import com.overnight.OverNight.infrastructure.UserRepo;
import com.overnight.OverNight.infrastructure.RoomRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepo reservationRepo;
    private final UserRepo userRepo;
    private final RoomRepo roomRepo;
    private final UserService userService;

    @Transactional
    public Reservation createReservation(Reservation reservation) {

        if (reservation.getUser() == null || reservation.getUser().getId() == null) {
            throw new RuntimeException("User is required for reservation");
        }

        User user = userService.findById(reservation.getUser().getId());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        reservation.setUser(user);

        if (reservation.getRoom() == null || reservation.getRoom().getId() == null) {
            throw new RuntimeException("Room is required for reservation");
        }

        Room room = roomRepo.findByIdAndDeletedAtIsNull(reservation.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + reservation.getRoom().getId()));
        reservation.setRoom(room);

        if (reservation.getNights() == null || reservation.getNights() == 0) {
            LocalDate checkIn = LocalDate.parse(reservation.getCheckInDate());
            LocalDate checkOut = LocalDate.parse(reservation.getCheckOutDate());
            int nights = (int) ChronoUnit.DAYS.between(checkIn, checkOut);
            reservation.setNights(nights);
        }

        if (reservation.getTotalPrice() == null || reservation.getTotalPrice() == 0) {
            if (reservation.getRoom() != null && reservation.getRoom().getPrice() != null) {
                double total = reservation.getNights() * reservation.getRoom().getPrice();
                reservation.setTotalPrice(total);
            }
        }

        if (reservation.getReservationNumber() == null) {
            reservation.setReservationNumber("RES-" + System.currentTimeMillis());
        }

        if (reservation.getStatus() == null) {
            reservation.setStatus("UPCOMING");
        }

        reservation.setIsActive(true);
        return reservationRepo.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getAllReservations() {
        return reservationRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public Reservation getReservationById(Long id) {
        return reservationRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Reservation getReservationByNumber(String number) {
        return reservationRepo.findByReservationNumberAndDeletedAtIsNull(number)
                .orElseThrow(() -> new RuntimeException("Reservation not found with number: " + number));
    }

    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepo.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByRoom(Long roomId) {
        return reservationRepo.findByRoomId(roomId);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getReservationsByStatus(String status) {
        return reservationRepo.findByStatus(status);
    }

    @Transactional
    public Reservation updateReservation(Long id, Reservation updatedReservation) {
        Reservation reservation = getReservationById(id);

        if (updatedReservation.getCheckInDate() != null) {
            reservation.setCheckInDate(updatedReservation.getCheckInDate());
        }
        if (updatedReservation.getCheckOutDate() != null) {
            reservation.setCheckOutDate(updatedReservation.getCheckOutDate());
        }
        if (updatedReservation.getNights() != null) {
            reservation.setNights(updatedReservation.getNights());
        }
        if (updatedReservation.getGuests() != null) {
            reservation.setGuests(updatedReservation.getGuests());
        }
        if (updatedReservation.getTotalPrice() != null) {
            reservation.setTotalPrice(updatedReservation.getTotalPrice());
        }
        if (updatedReservation.getSpecialRequests() != null) {
            reservation.setSpecialRequests(updatedReservation.getSpecialRequests());
        }
        if (updatedReservation.getStatus() != null) {
            reservation.setStatus(updatedReservation.getStatus());
        }
        if (updatedReservation.getUser() != null && updatedReservation.getUser().getId() != null) {
            User user = userRepo.findByIdAndDeletedAtIsNull(updatedReservation.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            reservation.setUser(user);
        }
        if (updatedReservation.getRoom() != null && updatedReservation.getRoom().getId() != null) {
            Room room = roomRepo.findByIdAndDeletedAtIsNull(updatedReservation.getRoom().getId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            reservation.setRoom(room);
        }

        return reservationRepo.save(reservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setDeletedAt(java.time.LocalDateTime.now());
        reservation.setIsActive(false);
        reservationRepo.save(reservation);
    }

    @Transactional
    public Reservation updateStatus(Long id, String status) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(status);
        return reservationRepo.save(reservation);
    }

    @Transactional
    public Reservation cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus("CANCELLED");
        reservation.setIsActive(false);
        return reservationRepo.save(reservation);
    }

    @Transactional
    public Reservation checkIn(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus("ACTIVE");
        return reservationRepo.save(reservation);
    }

    @Transactional
    public Reservation checkOut(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus("COMPLETED");
        Reservation saved = reservationRepo.save(reservation);
        if (saved.getUser() != null && saved.getUser().getId() != null) {
            userService.incrementStays(saved.getUser().getId());
        }
        return saved;
    }

    @Transactional
    public Reservation completeReservation(Long id) {
        Reservation reservation = getReservationById(id);
        if ("COMPLETED".equals(reservation.getStatus())) {
            throw new RuntimeException("Reservation " + id + " is already completed");
        }
        reservation.setStatus("COMPLETED");
        Reservation saved = reservationRepo.save(reservation);
        if (saved.getUser() != null && saved.getUser().getId() != null) {
            userService.incrementStays(saved.getUser().getId());
        }
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Reservation> getUpcomingReservationsByUser(Long userId) {
        String today = LocalDate.now().toString();
        return reservationRepo.findUpcomingByUser(userId, today);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getPastReservationsByUser(Long userId) {
        String today = LocalDate.now().toString();
        return reservationRepo.findPastByUser(userId, today);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getUpcomingReservations() {
        String today = LocalDate.now().toString();
        return reservationRepo.findUpcomingReservations(today);
    }

    @Transactional(readOnly = true)
    public List<Reservation> getPastReservations() {
        String today = LocalDate.now().toString();
        return reservationRepo.findPastReservations(today);
    }

    @Transactional(readOnly = true)
    public Long countActiveByRoom(Long roomId) {
        return reservationRepo.countActiveByRoomId(roomId);
    }

    @Transactional(readOnly = true)
    public Double getTotalRevenue() {
        Double revenue = reservationRepo.getTotalRevenue();
        return revenue != null ? revenue : 0.0;
    }

    @Transactional(readOnly = true)
    public boolean isRoomAvailable(Long roomId, String checkIn, String checkOut) {
        long overlapping = reservationRepo.countOverlappingReservations(
                roomId,
                checkIn,
                checkOut
        );
        return overlapping == 0;
    }

    @Transactional(readOnly = true)
    public List<String> getUnavailableDates(Long roomId) {
        return reservationRepo.findUnavailableDates(roomId, LocalDate.now().toString());
    }

    @Transactional
    public Reservation confirmReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus("CONFIRMED");
        return reservationRepo.save(reservation);
    }
}
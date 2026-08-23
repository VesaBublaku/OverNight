package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.RoomService;
import com.overnight.OverNight.domain.Room;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Room>> getActiveRooms() {
        return ResponseEntity.ok(roomService.getActiveRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/number/{roomNumber}")
    public ResponseEntity<Room> getRoomByNumber(@PathVariable String roomNumber) {
        return ResponseEntity.ok(roomService.getRoomByNumber(roomNumber));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotel(hotelId));
    }

    @GetMapping("/room-type/{roomTypeId}")
    public ResponseEntity<List<Room>> getRoomsByRoomType(@PathVariable Long roomTypeId) {
        return ResponseEntity.ok(roomService.getRoomsByRoomType(roomTypeId));
    }

    @GetMapping("/capacity/{capacity}")
    public ResponseEntity<List<Room>> getRoomsByCapacity(@PathVariable Integer capacity) {
        return ResponseEntity.ok(roomService.getRoomsByCapacity(capacity));
    }

    @GetMapping("/max-price/{maxPrice}")
    public ResponseEntity<List<Room>> getRoomsByMaxPrice(@PathVariable Double maxPrice) {
        return ResponseEntity.ok(roomService.getRoomsByMaxPrice(maxPrice));
    }

    @GetMapping("/extendable")
    public ResponseEntity<List<Room>> getExtendableRooms() {
        return ResponseEntity.ok(roomService.getExtendableRooms());
    }

    @GetMapping("/hotel/{hotelId}/capacity/{capacity}")
    public ResponseEntity<List<Room>> getRoomsByHotelAndCapacity(
            @PathVariable Long hotelId,
            @PathVariable Integer capacity) {
        return ResponseEntity.ok(roomService.getRoomsByHotelAndCapacity(hotelId, capacity));
    }

    @GetMapping("/hotel/{hotelId}/max-price/{maxPrice}")
    public ResponseEntity<List<Room>> getRoomsByHotelAndMaxPrice(
            @PathVariable Long hotelId,
            @PathVariable Double maxPrice) {
        return ResponseEntity.ok(roomService.getRoomsByHotelAndMaxPrice(hotelId, maxPrice));
    }

    @GetMapping("/amenity/{amenityId}")
    public ResponseEntity<List<Room>> getRoomsByAmenity(@PathVariable Long amenityId) {
        return ResponseEntity.ok(roomService.getRoomsByAmenity(amenityId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Room>> searchRooms(@RequestParam String keyword) {
        return ResponseEntity.ok(roomService.searchRooms(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room created = roomService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @RequestBody Room room) {
        Room updated = roomService.updateRoom(id, room);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateRoom(@PathVariable Long id) {
        roomService.activateRoom(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateRoom(@PathVariable Long id) {
        roomService.deactivateRoom(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{roomId}/amenity/{amenityId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> addAmenityToRoom(
            @PathVariable Long roomId,
            @PathVariable Long amenityId) {
        Room updated = roomService.addAmenityToRoom(roomId, amenityId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{roomId}/amenity/{amenityId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Room> removeAmenityFromRoom(
            @PathVariable Long roomId,
            @PathVariable Long amenityId) {
        Room updated = roomService.removeAmenityFromRoom(roomId, amenityId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/exists/{roomNumber}")
    public ResponseEntity<Map<String, Boolean>> existsByRoomNumber(@PathVariable String roomNumber) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", roomService.existsByRoomNumber(roomNumber));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/hotel/{hotelId}")
    public ResponseEntity<Map<String, Long>> countRoomsByHotel(@PathVariable Long hotelId) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", roomService.countRoomsByHotel(hotelId));
        return ResponseEntity.ok(response);
    }
}
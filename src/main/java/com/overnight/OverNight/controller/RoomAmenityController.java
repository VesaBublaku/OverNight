package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.RoomAmenityService;
import com.overnight.OverNight.domain.RoomAmenity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room-amenities")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class RoomAmenityController {

    private final RoomAmenityService roomAmenityService;

    @GetMapping
    public ResponseEntity<List<RoomAmenity>> getAllRoomAmenities() {
        return ResponseEntity.ok(roomAmenityService.getAllRoomAmenities());
    }

    @GetMapping("/active")
    public ResponseEntity<List<RoomAmenity>> getActiveRoomAmenities() {
        return ResponseEntity.ok(roomAmenityService.getActiveRoomAmenities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomAmenity> getRoomAmenityById(@PathVariable Long id) {
        return ResponseEntity.ok(roomAmenityService.getRoomAmenityById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<RoomAmenity> getRoomAmenityByName(@PathVariable String name) {
        return ResponseEntity.ok(roomAmenityService.getRoomAmenityByName(name));
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<RoomAmenity>> getAmenitiesByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomAmenityService.getAmenitiesByRoom(roomId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomAmenity>> searchRoomAmenities(@RequestParam String keyword) {
        return ResponseEntity.ok(roomAmenityService.searchRoomAmenities(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomAmenity> createRoomAmenity(@RequestBody RoomAmenity amenity) {
        RoomAmenity created = roomAmenityService.createRoomAmenity(amenity);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomAmenity> updateRoomAmenity(
            @PathVariable Long id,
            @RequestBody RoomAmenity amenity) {
        RoomAmenity updated = roomAmenityService.updateRoomAmenity(id, amenity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteRoomAmenity(@PathVariable Long id) {
        roomAmenityService.deleteRoomAmenity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room amenity deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateRoomAmenity(@PathVariable Long id) {
        roomAmenityService.activateRoomAmenity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room amenity activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateRoomAmenity(@PathVariable Long id) {
        roomAmenityService.deactivateRoomAmenity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room amenity deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exists/{name}")
    public ResponseEntity<Map<String, Boolean>> existsByName(@PathVariable String name) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", roomAmenityService.existsByName(name));
        return ResponseEntity.ok(response);
    }
}
package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.RoomTypeService;
import com.overnight.OverNight.domain.RoomType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room-types")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public ResponseEntity<List<RoomType>> getAllRoomTypes() {
        return ResponseEntity.ok(roomTypeService.getAllRoomTypes());
    }

    @GetMapping("/active")
    public ResponseEntity<List<RoomType>> getActiveRoomTypes() {
        return ResponseEntity.ok(roomTypeService.getActiveRoomTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomType> getRoomTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(roomTypeService.getRoomTypeById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<RoomType> getRoomTypeByName(@PathVariable String name) {
        return ResponseEntity.ok(roomTypeService.getRoomTypeByName(name));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomType>> getRoomTypesByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomTypeService.getRoomTypesByHotel(hotelId));
    }

    @GetMapping("/occupancy/{occupancy}")
    public ResponseEntity<List<RoomType>> getRoomTypesByMinOccupancy(@PathVariable Integer occupancy) {
        return ResponseEntity.ok(roomTypeService.getRoomTypesByMinOccupancy(occupancy));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RoomType>> searchRoomTypes(@RequestParam String keyword) {
        return ResponseEntity.ok(roomTypeService.searchRoomTypes(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType) {
        RoomType created = roomTypeService.createRoomType(roomType);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomType> updateRoomType(
            @PathVariable Long id,
            @RequestBody RoomType roomType) {
        RoomType updated = roomTypeService.updateRoomType(id, roomType);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteRoomType(@PathVariable Long id) {
        roomTypeService.deleteRoomType(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room type deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateRoomType(@PathVariable Long id) {
        roomTypeService.activateRoomType(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room type activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateRoomType(@PathVariable Long id) {
        roomTypeService.deactivateRoomType(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Room type deactivated successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/exists/{name}")
    public ResponseEntity<Map<String, Boolean>> existsByName(@PathVariable String name) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", roomTypeService.existsByName(name));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/hotel/{hotelId}")
    public ResponseEntity<Map<String, Long>> countRoomTypesByHotel(@PathVariable Long hotelId) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", roomTypeService.countRoomTypesByHotel(hotelId));
        return ResponseEntity.ok(response);
    }
}
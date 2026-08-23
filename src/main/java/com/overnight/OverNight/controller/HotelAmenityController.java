package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.HotelAmenityService;
import com.overnight.OverNight.domain.HotelAmenity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotel-amenities")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class HotelAmenityController {

    private final HotelAmenityService hotelAmenityService;

    @GetMapping
    public ResponseEntity<List<HotelAmenity>> getAllHotelAmenities() {
        return ResponseEntity.ok(hotelAmenityService.getAllHotelAmenities());
    }

    @GetMapping("/active")
    public ResponseEntity<List<HotelAmenity>> getActiveHotelAmenities() {
        return ResponseEntity.ok(hotelAmenityService.getActiveHotelAmenities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelAmenity> getHotelAmenityById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelAmenityService.getHotelAmenityById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<HotelAmenity> getHotelAmenityByName(@PathVariable String name) {
        return ResponseEntity.ok(hotelAmenityService.getHotelAmenityByName(name));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<HotelAmenity>> getAmenitiesByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(hotelAmenityService.getAmenitiesByHotel(hotelId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<HotelAmenity>> searchHotelAmenities(@RequestParam String keyword) {
        return ResponseEntity.ok(hotelAmenityService.searchHotelAmenities(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelAmenity> createHotelAmenity(@RequestBody HotelAmenity amenity) {
        HotelAmenity created = hotelAmenityService.createHotelAmenity(amenity);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelAmenity> updateHotelAmenity(
            @PathVariable Long id,
            @RequestBody HotelAmenity amenity) {
        HotelAmenity updated = hotelAmenityService.updateHotelAmenity(id, amenity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteHotelAmenity(@PathVariable Long id) {
        hotelAmenityService.deleteHotelAmenity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel amenity deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateHotelAmenity(@PathVariable Long id) {
        hotelAmenityService.activateHotelAmenity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel amenity activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateHotelAmenity(@PathVariable Long id) {
        hotelAmenityService.deactivateHotelAmenity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel amenity deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/hotel/{hotelId}/amenity/{amenityId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> addAmenityToHotel(
            @PathVariable Long hotelId,
            @PathVariable Long amenityId) {
        hotelAmenityService.addAmenityToHotel(hotelId, amenityId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Amenity added to hotel successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/hotel/{hotelId}/amenity/{amenityId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> removeAmenityFromHotel(
            @PathVariable Long hotelId,
            @PathVariable Long amenityId) {
        hotelAmenityService.removeAmenityFromHotel(hotelId, amenityId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Amenity removed from hotel successfully");
        return ResponseEntity.ok(response);
    }
}

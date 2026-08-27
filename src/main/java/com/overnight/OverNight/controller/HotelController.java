package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.HotelService;
import com.overnight.OverNight.domain.Hotel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Hotel>> getActiveHotels() {
        return ResponseEntity.ok(hotelService.getActiveHotels());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.getHotelById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Hotel> getHotelByName(@PathVariable String name) {
        return ResponseEntity.ok(hotelService.getHotelByName(name));
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Hotel>> getHotelsByCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(hotelService.getHotelsByCity(cityId));
    }

    @GetMapping("/city/name/{cityName}")
    public ResponseEntity<List<Hotel>> getHotelsByCityName(@PathVariable String cityName) {
        return ResponseEntity.ok(hotelService.getHotelsByCityName(cityName));
    }

    @GetMapping("/chain/{chain}")
    public ResponseEntity<List<Hotel>> getHotelsByChain(@PathVariable String chain) {
        return ResponseEntity.ok(hotelService.getHotelsByChain(chain));
    }

    @GetMapping("/rating/{rating}")
    public ResponseEntity<List<Hotel>> getHotelsByRating(@PathVariable Integer rating) {
        return ResponseEntity.ok(hotelService.getHotelsByRating(rating));
    }

    @GetMapping("/hotel-chain/{chainId}")
    public ResponseEntity<List<Hotel>> getHotelsByHotelChain(@PathVariable Long chainId) {
        return ResponseEntity.ok(hotelService.getHotelsByHotelChain(chainId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(@RequestParam String keyword) {
        return ResponseEntity.ok(hotelService.searchHotels(keyword));
    }

    @GetMapping("/chains")
    public ResponseEntity<List<String>> getAllChains() {
        return ResponseEntity.ok(hotelService.getAllChains());
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        Hotel created = hotelService.createHotel(hotel);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(
            @PathVariable Long id,
            @RequestBody Hotel hotel) {
        Hotel updated = hotelService.updateHotel(id, hotel);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Map<String, String>> activateHotel(@PathVariable Long id) {
        hotelService.activateHotel(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateHotel(@PathVariable Long id) {
        hotelService.deactivateHotel(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exists/{name}")
    public ResponseEntity<Map<String, Boolean>> existsByName(@PathVariable String name) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", hotelService.existsByName(name));
        return ResponseEntity.ok(response);
    }
}
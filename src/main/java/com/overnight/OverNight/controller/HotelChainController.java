package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.HotelChainService;
import com.overnight.OverNight.domain.HotelChain;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hotel-chains")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class HotelChainController {

    private final HotelChainService hotelChainService;

    @GetMapping
    public ResponseEntity<List<HotelChain>> getAllHotelChains() {
        return ResponseEntity.ok(hotelChainService.getAllHotelChains());
    }

    @GetMapping("/active")
    public ResponseEntity<List<HotelChain>> getActiveHotelChains() {
        return ResponseEntity.ok(hotelChainService.getActiveHotelChains());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelChain> getHotelChainById(@PathVariable Long id) {
        return ResponseEntity.ok(hotelChainService.getHotelChainById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<HotelChain> getHotelChainByName(@PathVariable String name) {
        return ResponseEntity.ok(hotelChainService.getHotelChainByName(name));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<HotelChain> getHotelChainByHotelId(@PathVariable Long hotelId) {
        return ResponseEntity.ok(hotelChainService.getHotelChainByHotelId(hotelId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<HotelChain>> searchHotelChains(@RequestParam String keyword) {
        return ResponseEntity.ok(hotelChainService.searchHotelChains(keyword));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getTotalChains() {
        Map<String, Long> response = new HashMap<>();
        response.put("total", hotelChainService.getTotalChains());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelChain> createHotelChain(@RequestBody HotelChain hotelChain) {
        HotelChain created = hotelChainService.createHotelChain(hotelChain);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelChain> updateHotelChain(
            @PathVariable Long id,
            @RequestBody HotelChain hotelChain) {
        HotelChain updated = hotelChainService.updateHotelChain(id, hotelChain);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteHotelChain(@PathVariable Long id) {
        hotelChainService.deleteHotelChain(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel chain deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateHotelChain(@PathVariable Long id) {
        hotelChainService.activateHotelChain(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel chain activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateHotelChain(@PathVariable Long id) {
        hotelChainService.deactivateHotelChain(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hotel chain deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/increment-hotel-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelChain> incrementHotelCount(@PathVariable Long id) {
        HotelChain updated = hotelChainService.incrementHotelCount(id);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/decrement-hotel-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelChain> decrementHotelCount(@PathVariable Long id) {
        HotelChain updated = hotelChainService.decrementHotelCount(id);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/exists/{name}")
    public ResponseEntity<Map<String, Boolean>> existsByName(@PathVariable String name) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", hotelChainService.existsByName(name));
        return ResponseEntity.ok(response);
    }
}
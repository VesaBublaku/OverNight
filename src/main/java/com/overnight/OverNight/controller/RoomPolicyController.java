package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.RoomPolicyService;
import com.overnight.OverNight.domain.RoomPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room-policies")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class RoomPolicyController {

    private final RoomPolicyService roomPolicyService;

    @GetMapping
    public ResponseEntity<List<RoomPolicy>> getAllPolicies() {
        return ResponseEntity.ok(roomPolicyService.getAllPolicies());
    }

    @GetMapping("/active")
    public ResponseEntity<List<RoomPolicy>> getActivePolicies() {
        return ResponseEntity.ok(roomPolicyService.getActivePolicies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomPolicy> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(roomPolicyService.getPolicyById(id));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomPolicy>> getPoliciesByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomPolicyService.getPoliciesByHotel(hotelId));
    }

    @GetMapping("/hotel/{hotelId}/type/{policyType}")
    public ResponseEntity<List<RoomPolicy>> getPoliciesByHotelAndType(
            @PathVariable Long hotelId,
            @PathVariable String policyType) {
        return ResponseEntity.ok(roomPolicyService.getPoliciesByHotelAndType(hotelId, policyType));
    }

    @GetMapping("/type/{policyType}")
    public ResponseEntity<List<RoomPolicy>> getPoliciesByType(@PathVariable String policyType) {
        return ResponseEntity.ok(roomPolicyService.getPoliciesByType(policyType));
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllPolicyTypes() {
        return ResponseEntity.ok(roomPolicyService.getAllPolicyTypes());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomPolicy> createPolicy(@RequestBody RoomPolicy policy) {
        RoomPolicy created = roomPolicyService.createRoomPolicy(policy);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomPolicy> updatePolicy(
            @PathVariable Long id,
            @RequestBody RoomPolicy policy) {
        RoomPolicy updated = roomPolicyService.updateRoomPolicy(id, policy);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deletePolicy(@PathVariable Long id) {
        roomPolicyService.deleteRoomPolicy(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Policy deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activatePolicy(@PathVariable Long id) {
        roomPolicyService.activatePolicy(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Policy activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivatePolicy(@PathVariable Long id) {
        roomPolicyService.deactivatePolicy(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Policy deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count/hotel/{hotelId}")
    public ResponseEntity<Map<String, Long>> countPoliciesByHotel(@PathVariable Long hotelId) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", roomPolicyService.countPoliciesByHotel(hotelId));
        return ResponseEntity.ok(response);
    }
}
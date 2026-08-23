package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.ServiceService;
import com.overnight.OverNight.domain.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Service>> getActiveServices() {
        return ResponseEntity.ok(serviceService.getActiveServices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Service>> getServicesByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(serviceService.getServicesByHotel(hotelId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String keyword) {
        return ResponseEntity.ok(serviceService.searchServices(keyword));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        Service created = serviceService.createService(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @RequestBody Service service) {
        Service updated = serviceService.updateService(id, service);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Service deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateService(@PathVariable Long id) {
        serviceService.activateService(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Service activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateService(@PathVariable Long id) {
        serviceService.deactivateService(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Service deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Service> reorderService(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request) {
        Integer newOrder = request.get("displayOrder");
        Service updated = serviceService.reorderService(id, newOrder);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/count/hotel/{hotelId}")
    public ResponseEntity<Map<String, Long>> countServicesByHotel(@PathVariable Long hotelId) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", serviceService.countServicesByHotel(hotelId));
        return ResponseEntity.ok(response);
    }
}
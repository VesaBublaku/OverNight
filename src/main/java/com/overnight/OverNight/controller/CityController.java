package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.CityService;
import com.overnight.OverNight.domain.City;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        return ResponseEntity.ok(cityService.getAllCities());
    }

    @GetMapping("/active")
    public ResponseEntity<List<City>> getActiveCities() {
        return ResponseEntity.ok(cityService.getActiveCities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        return ResponseEntity.ok(cityService.getCityById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<City> getCityByName(@PathVariable String name) {
        return ResponseEntity.ok(cityService.getCityByName(name));
    }

    @PostMapping
    public ResponseEntity<City> createCity(@RequestBody City city) {
        City created = cityService.createCity(city);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<City> updateCity(
            @PathVariable Long id,
            @RequestBody City city) {
        City updated = cityService.updateCity(id, city);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteCity(@PathVariable Long id) {
        cityService.deleteCity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "City deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateCity(@PathVariable Long id) {
        cityService.activateCity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "City activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateCity(@PathVariable Long id) {
        cityService.deactivateCity(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "City deactivated successfully");
        return ResponseEntity.ok(response);
    }
}
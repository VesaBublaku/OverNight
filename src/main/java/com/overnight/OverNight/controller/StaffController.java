package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.StaffService;
import com.overnight.OverNight.domain.Staff;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Staff loginRequest) {
        System.out.println("📥 Staff login attempt for: " + loginRequest.getEmail());
        Map<String, Object> response = staffService.login(
                loginRequest.getEmail(),
                loginRequest.getPasswordHash()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Staff staff) {
        System.out.println("📥 Staff registration for: " + staff.getEmail());
        Map<String, Object> response = staffService.register(staff);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Staff> getCurrentStaff(@RequestAttribute("userId") Long staffId) {
        return ResponseEntity.ok(staffService.getCurrentStaff(staffId));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Staff> updateCurrentStaff(
            @RequestAttribute("userId") Long staffId,
            @RequestBody Staff updatedStaff) {
        return ResponseEntity.ok(staffService.updateStaff(staffId, updatedStaff));
    }

    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteCurrentStaff(@RequestAttribute("userId") Long staffId) {
        staffService.deleteStaff(staffId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff account deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> updatePassword(
            @RequestAttribute("userId") Long staffId,
            @RequestBody Map<String, String> request) {
        staffService.updatePassword(staffId, request.get("newPassword"));
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Long id,
            @RequestBody Staff updatedStaff) {
        return ResponseEntity.ok(staffService.updateStaff(id, updatedStaff));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activateStaff(@PathVariable Long id) {
        staffService.activateStaff(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateStaff(@PathVariable Long id) {
        staffService.deactivateStaff(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Staff>> getStaffByRole(@PathVariable String role) {
        return ResponseEntity.ok(staffService.getStaffByRole(role));
    }

    @GetMapping("/exists/{email}")
    public ResponseEntity<Map<String, Boolean>> existsByEmail(@PathVariable String email) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", staffService.existsByEmail(email));
        return ResponseEntity.ok(response);
    }
}
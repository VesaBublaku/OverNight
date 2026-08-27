package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.StaffService;
import com.overnight.OverNight.domain.Staff;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = {"http://localhost:4300", "http://localhost:4200"})
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Staff loginRequest, HttpServletRequest request) {
        System.out.println("Staff login attempt for: " + loginRequest.getEmail());
        Map<String, Object> response = staffService.login(
                loginRequest.getEmail(),
                loginRequest.getPasswordHash(),
                request
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Staff staff, HttpServletRequest request) {
        System.out.println("📥 Staff registration for: " + staff.getEmail());
        Map<String, Object> response = staffService.register(staff, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exists/{email}")
    public ResponseEntity<Map<String, Boolean>> existsByEmail(@PathVariable String email) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", staffService.existsByEmail(email));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Staff> getCurrentStaff(@RequestAttribute("userId") Long staffId) {
        return ResponseEntity.ok(staffService.getCurrentStaff(staffId));
    }

    @PutMapping("/me")
    public ResponseEntity<Staff> updateCurrentStaff(
            @RequestAttribute("userId") Long staffId,
            @RequestBody Staff updatedStaff,
            HttpServletRequest request) {
        Staff staff = staffService.updateStaff(staffId, updatedStaff, request);
        return ResponseEntity.ok(staff);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteCurrentStaff(
            @RequestAttribute("userId") Long staffId,
            HttpServletRequest request) {
        staffService.deleteStaff(staffId, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff account deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            @RequestAttribute("userId") Long staffId,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        staffService.updatePassword(staffId, request.get("newPassword"));
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestAttribute("userId") Long staffId) {
        Staff staff = staffService.findById(staffId);
        staffService.logout(staff);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Long id,
            @RequestBody Staff updatedStaff,
            HttpServletRequest request) {
        Staff staff = staffService.updateStaff(id, updatedStaff, request);
        return ResponseEntity.ok(staff);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStaff(
            @PathVariable Long id,
            HttpServletRequest request) {
        staffService.deleteStaff(id, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Map<String, String>> activateStaff(
            @PathVariable Long id) {
        staffService.activateStaff(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateStaff(
            @PathVariable Long id) {
        staffService.deactivateStaff(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Staff deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Staff>> getStaffByRole(@PathVariable String role) {
        return ResponseEntity.ok(staffService.getStaffByRole(role));
    }
}
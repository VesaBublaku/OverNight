package com.overnight.OverNight.application;

import com.overnight.OverNight.config.JwtUtil;
import com.overnight.OverNight.domain.Staff;
import com.overnight.OverNight.infrastructure.StaffRepo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepo staffRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ActivityLogService activityLogService;

    public Map<String, Object> login(String email, String password, HttpServletRequest request) {
        System.out.println("=== STAFF LOGIN ATTEMPT ===");
        System.out.println("Email: " + email);

        Staff staff = staffRepo.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> {
                    System.out.println("Staff NOT found for email: " + email);
                    return new RuntimeException("Invalid credentials");
                });

        System.out.println("Staff found: " + staff.getEmail());
        System.out.println("Role: " + staff.getRole());

        if (!passwordEncoder.matches(password, staff.getPasswordHash())) {
            System.out.println("Password does NOT match!");
            throw new RuntimeException("Invalid credentials");
        }

        if (!staff.getIsActive()) {
            System.out.println("Staff is inactive!");
            throw new RuntimeException("Account is deactivated");
        }

        String role = staff.getRole() != null ? staff.getRole() : "STAFF";
        String token = jwtUtil.generateToken(staff.getEmail(), staff.getId(),role);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("staff", staff);

        activityLogService.logLogin(staff, request);

        return response;
    }

    @Transactional
    public Map<String, Object> register(Staff staff,HttpServletRequest request) {
        System.out.println("=== STAFF REGISTER ===");
        System.out.println("Email: " + staff.getEmail());

        if (staffRepo.existsByEmailAndDeletedAtIsNull(staff.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (staff.getPasswordHash() == null || staff.getPasswordHash().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        staff.setPasswordHash(passwordEncoder.encode(staff.getPasswordHash()));
        staff.setIsActive(true);

        Staff savedStaff = staffRepo.save(staff);
        System.out.println("Staff saved with ID: " + savedStaff.getId());

        String role = staff.getRole() != null ? staff.getRole() : "STAFF";
        String token = jwtUtil.generateToken(savedStaff.getEmail(), savedStaff.getId(),role);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("staff", savedStaff);

        activityLogService.logWithIp("CREATE", "STAFF", savedStaff.getId(),
                "Staff registered: " + savedStaff.getEmail(), request);

        return response;
    }

    public void logout(Staff staff) {
        activityLogService.logLogout(staff);
    }

    @Transactional(readOnly = true)
    public Staff getCurrentStaff(Long staffId) {
        return findById(staffId);
    }

    @Transactional
    public Staff updateStaff(Long staffId, Staff updatedStaff,HttpServletRequest request) {
        Staff staff = findById(staffId);

        if (updatedStaff.getFirstName() != null) staff.setFirstName(updatedStaff.getFirstName());
        if (updatedStaff.getLastName() != null) staff.setLastName(updatedStaff.getLastName());
        if (updatedStaff.getPhone() != null) staff.setPhone(updatedStaff.getPhone());
        if (updatedStaff.getEmail() != null) staff.setEmail(updatedStaff.getEmail());
        if (updatedStaff.getRole() != null) staff.setRole(updatedStaff.getRole());

        Staff savedStaff = staffRepo.save(staff);

        activityLogService.logWithIp("UPDATE", "STAFF", staffId,
                "Staff updated: " + savedStaff.getEmail(), request);

        return savedStaff;
    }

    @Transactional
    public void deleteStaff(Long staffId,HttpServletRequest request) {
        Staff staff = findById(staffId);
        staff.setDeletedAt(LocalDateTime.now());
        staff.setIsActive(false);
        staffRepo.save(staff);

        activityLogService.logWithIp("DELETE", "STAFF", staffId,
                "Staff deleted: " + staff.getEmail(), request);
    }

    @Transactional(readOnly = true)
    public List<Staff> getAllStaff() {
        return staffRepo.findAllActiveStaff();
    }

    @Transactional(readOnly = true)
    public Staff getStaffById(Long id) {
        return findById(id);
    }

    @Transactional
    public void activateStaff(Long id) {
        Staff staff = findById(id);
        staff.setIsActive(true);
        staffRepo.save(staff);
    }

    @Transactional
    public void deactivateStaff(Long id) {
        Staff staff = findById(id);
        staff.setIsActive(false);
        staffRepo.save(staff);
    }

    @Transactional
    public List<Staff> getStaffByRole(String role) {
        return staffRepo.findByRole(role);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return staffRepo.existsByEmailAndDeletedAtIsNull(email);
    }

    @Transactional(readOnly = true)
    public Staff findById(Long id) {
        return staffRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Staff findByEmail(String email) {
        return staffRepo.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("Staff not found with email: " + email));
    }

    @Transactional
    public void updatePassword(Long staffId, String newPassword) {
        Staff staff = findById(staffId);
        staff.setPasswordHash(passwordEncoder.encode(newPassword));
        staffRepo.save(staff);
    }
}
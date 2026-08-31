package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.UserService;
import com.overnight.OverNight.domain.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody User loginRequest, HttpServletRequest request) {
        System.out.println("===== LOGIN REQUEST =====");
        System.out.println("Email: " + loginRequest.getEmail());
        System.out.println("PasswordHash (from Angular): '" + loginRequest.getPasswordHash() + "'");
        System.out.println("PasswordHash length: " + (loginRequest.getPasswordHash() != null ? loginRequest.getPasswordHash().length() : 0));

        Map<String, Object> response = userService.login(
                loginRequest.getEmail(),
                loginRequest.getPasswordHash(),
                request
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user, HttpServletRequest request) {
        Map<String, Object> response = userService.register(user, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestAttribute("userId") Long userId) {
        return ResponseEntity.ok(userService.getCurrentUser(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @RequestAttribute("userId") Long userId,
            @RequestBody User updatedUser,
            HttpServletRequest request) {
        User user = userService.updateUser(userId, updatedUser, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteCurrentUser(
            @RequestAttribute("userId") Long userId,
            HttpServletRequest request) {
        userService.deleteUser(userId, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Account deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            @RequestAttribute("userId") Long userId,
            @RequestBody Map<String, String> request) {
        userService.updatePassword(userId, request.get("newPassword"));
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestAttribute("userId") Long userId) {
        User user = userService.findById(userId);
        userService.logout(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id, @RequestAttribute("userId") Long userId) {
        System.out.println("🔍 Requested ID: " + id);
        System.out.println("🔍 Authenticated User ID: " + userId);

        if (userId.equals(id)) {
            return ResponseEntity.ok(userService.getUserById(id));
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            boolean isAdminOrStaff = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"));
            if (isAdminOrStaff) {
                return ResponseEntity.ok(userService.getUserById(id));
            }
        }

        throw new RuntimeException("You do not have permission to access this profile");
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser,
            HttpServletRequest request) {
        User user = userService.updateUser(id, updatedUser, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long id,
            HttpServletRequest request) {
        userService.deleteUser(id, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Map<String, String>> activateUser(
            @PathVariable Long id) {
        userService.activateUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User activated successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Map<String, String>> deactivateUser(
            @PathVariable Long id) {
        userService.deactivateUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deactivated successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/exists/{email}")
    public ResponseEntity<Map<String, Boolean>> existsByEmail(@PathVariable String email) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", userService.existsByEmail(email));
        return ResponseEntity.ok(response);
    }

}
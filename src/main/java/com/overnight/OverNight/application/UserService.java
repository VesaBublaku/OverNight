package com.overnight.OverNight.application;

import com.overnight.OverNight.config.JwtUtil;
import com.overnight.OverNight.domain.User;
import com.overnight.OverNight.infrastructure.UserRepo;
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
public class UserService {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ActivityLogService activityLogService;

    public Map<String, Object> login(String email, String password, HttpServletRequest request) {
        System.out.println("Email: " + email);
        System.out.println("Password length: " + (password != null ? password.length() : 0));

        User user = userRepo.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> {
                    System.out.println("User NOT found for email: " + email);
                    return new RuntimeException("Invalid credentials");
                });

        System.out.println("User found: " + user.getEmail());
        System.out.println("Stored hash: " + user.getPasswordHash());

        boolean matches = passwordEncoder.matches(password, user.getPasswordHash());
        System.out.println("🔬 Password matches: " + matches);

        if (!matches) {
            System.out.println("Password does NOT match!");
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsActive()) {
            System.out.println("User is inactive!");
            throw new RuntimeException("Account is deactivated");
        }

        String role = user.getRole() != null ? user.getRole() : "USER";
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), role);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        activityLogService.logLogin(user, request);

        return response;
    }

    @Transactional
    public Map<String, Object> register(User user, HttpServletRequest request) {
        if (userRepo.existsByEmailAndDeletedAtIsNull(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setIsActive(true);

        User savedUser = userRepo.save(user);

        String token = jwtUtil.generateToken(
                savedUser.getEmail(),
                savedUser.getId(),
                savedUser.getRole()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);

        activityLogService.logWithIp("CREATE", "USER", savedUser.getId(),
                "User registered: " + savedUser.getEmail(), request);

        return response;
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(Long userId) {
        return findById(userId);
    }

    @Transactional
    public User updateUser(Long userId, User updatedUser, HttpServletRequest request) {
        User user = findById(userId);

        if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
        if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());
        if (updatedUser.getDob() != null) user.setDob(updatedUser.getDob());
        if (updatedUser.getMemberSince() != null) user.setMemberSince(updatedUser.getMemberSince());

        User savedUser = userRepo.save(user);

        activityLogService.logWithIp("UPDATE", "USER", userId,
                "User updated: " + savedUser.getEmail(), request);

        return savedUser;
    }

    @Transactional
    public void deleteUser(Long userId,HttpServletRequest request) {
        User user = findById(userId);
        user.setDeletedAt(LocalDateTime.now());
        user.setIsActive(false);
        userRepo.save(user);

        activityLogService.logWithIp("DELETE", "USER", userId,
                "User deleted: " + user.getEmail(), request);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepo.findAllActiveUsers();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return findById(id);
    }

    @Transactional
    public void activateUser(Long id) {
        User user = findById(id);
        user.setIsActive(true);
        userRepo.save(user);
    }

    @Transactional
    public void deactivateUser(Long id) {
        User user = findById(id);
        user.setIsActive(false);
        userRepo.save(user);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepo.existsByEmailAndDeletedAtIsNull(email);
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepo.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public void updatePassword(Long userId, String newPassword) {
        User user = findById(userId);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

    public void logout(User user) {
        activityLogService.logLogout(user);
    }
}
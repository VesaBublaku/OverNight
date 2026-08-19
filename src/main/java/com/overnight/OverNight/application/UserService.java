package com.overnight.OverNight.application;

import com.overnight.OverNight.config.JwtUtil;
import com.overnight.OverNight.domain.User;
import com.overnight.OverNight.infrastructure.UserRepo;
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

    public Map<String, Object> login(String email, String password) {
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

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return response;
    }

    @Transactional
    public Map<String, Object> register(User user) {
        if (userRepo.existsByEmailAndDeletedAtIsNull(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setIsActive(true);

        User savedUser = userRepo.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);

        return response;
    }

    @Transactional(readOnly = true)
    public User getCurrentUser(Long userId) {
        return findById(userId);
    }

    @Transactional
    public User updateUser(Long userId, User updatedUser) {
        User user = findById(userId);

        if (updatedUser.getFirstName() != null) user.setFirstName(updatedUser.getFirstName());
        if (updatedUser.getLastName() != null) user.setLastName(updatedUser.getLastName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getAddress() != null) user.setAddress(updatedUser.getAddress());
        if (updatedUser.getEmail() != null) user.setEmail(updatedUser.getEmail());

        return userRepo.save(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = findById(userId);
        user.setDeletedAt(LocalDateTime.now());
        user.setIsActive(false);
        userRepo.save(user);
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
}
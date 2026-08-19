package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.User;
import com.overnight.OverNight.infrastructure.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public User login(String email, String password) {
        User user = userRepo.findByEmailAndDeletedAtIsNull(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        return user;
    }

    @Transactional
    public User register(User user) {
        if (userRepo.existsByEmailAndDeletedAtIsNull(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setIsActive(true);

        return userRepo.save(user);
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
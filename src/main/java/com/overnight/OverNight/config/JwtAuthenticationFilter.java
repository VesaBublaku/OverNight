package com.overnight.OverNight.config;

import com.overnight.OverNight.domain.Staff;
import com.overnight.OverNight.domain.User;
import com.overnight.OverNight.infrastructure.StaffRepo;
import com.overnight.OverNight.infrastructure.UserRepo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;
    private final StaffRepo staffRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                Long userId = jwtUtil.extractUserId(token);
                String role = jwtUtil.extractRole(token);  // ✅ GET ROLE FROM TOKEN

                try {
                    Staff staff = staffRepo.findByEmailAndDeletedAtIsNull(email).orElse(null);
                    if (staff != null) {
                        authenticateStaff(request, email, userId, staff, role);
                    } else {
                        User user = userRepo.findByEmailAndDeletedAtIsNull(email).orElse(null);
                        if (user != null) {
                            authenticateUser(request, email, userId, user, role);
                        } else {
                            System.out.println("JWT valid but no account found for: " + email);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Authentication error: " + e.getMessage());
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private void authenticateStaff(HttpServletRequest request, String email, Long userId, Staff staff, String role) {
        String staffRole = staff.getRole() != null ? staff.getRole().toUpperCase().trim() : "STAFF";

        java.util.List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
        if ("ADMIN".equals(staffRole)) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        staff,
                        null,
                        authorities
                );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        request.setAttribute("userId", userId);
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("Staff authenticated: " + email + " with authorities: " + authorities);
    }

    private void authenticateUser(HttpServletRequest request, String email, Long userId, User user, String role) {
        String userRole = role != null ? role.toUpperCase().trim() : "USER";
        String authority = userRole.equals("ADMIN") ? "ROLE_ADMIN" : "ROLE_USER";

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        user,  // This is the User object with ID
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(authority))
                );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        request.setAttribute("userId", userId);
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("User authenticated: " + email + " with ID: " + userId + " and role: " + authority);
    }
}
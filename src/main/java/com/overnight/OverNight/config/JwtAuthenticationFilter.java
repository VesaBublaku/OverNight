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

                try {
                    Staff staff = staffRepo.findByEmailAndDeletedAtIsNull(email).orElse(null);
                    if (staff != null) {
                        authenticateStaff(request, email, userId, staff);
                    } else {
                        User user = userRepo.findByEmailAndDeletedAtIsNull(email).orElse(null);
                        if (user != null) {
                            authenticateUser(request, email, userId, user);
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

    private void authenticateStaff(HttpServletRequest request, String email, Long userId, Staff staff) {
        String role = staff.getRole() != null ? staff.getRole() : "STAFF";
        String normalized = role.startsWith("ROLE_") ? role.substring(5) : role;
        String roleName = "ROLE_" + normalized.toUpperCase();

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        staff,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority(roleName))
                );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        request.setAttribute("userId", userId);
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("Staff authenticated: " + email + " with role: " + roleName);
    }

    private void authenticateUser(HttpServletRequest request, String email, Long userId, User user) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                );
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        request.setAttribute("userId", userId);
        SecurityContextHolder.getContext().setAuthentication(authToken);
        System.out.println("User authenticated: " + email + " with role: ROLE_USER");
    }
}

package com.overnight.OverNight.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4300", "http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/exists/**",
                                "/api/staff/login",
                                "/api/staff/exists/**",
                                "/api/staff/register"
                        ).permitAll()
                        // Public GET endpoints (no authentication required)
                        .requestMatchers(HttpMethod.GET,
                                "/api/cities/**",
                                "/api/hotel-chains/**",
                                "/api/hotels",
                                "/api/hotels/**",
                                "/api/rooms",
                                "/api/rooms/**",
                                "/api/room-types/**",
                                "/api/room-amenities",
                                "/api/room-amenities/**",
                                "/api/hotel-amenities/**",
                                "/api/services/**",
                                "/api/room-policies/**"
                        ).permitAll()
                        // Admin only endpoints
                        .requestMatchers(HttpMethod.POST, "/api/hotels", "/api/hotels/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/hotels/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/hotels/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/rooms", "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms/**").hasRole("ADMIN")
                        // Staff and Admin endpoints
                        .requestMatchers("/api/users", "/api/users/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/payments", "/api/payments/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/reservations", "/api/reservations/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/receipts", "/api/receipts/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/staff", "/api/staff/**").hasAnyRole("STAFF", "ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
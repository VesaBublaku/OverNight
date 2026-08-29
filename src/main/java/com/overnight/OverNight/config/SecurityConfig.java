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
@EnableMethodSecurity
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
                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/exists/**",
                                "/api/staff/login",
                                "/api/staff/exists/**",
                                "/api/staff/register"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/reservations/check-availability").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reservations/unavailable-dates/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/hotels", "/api/hotels/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/hotels", "/api/hotels/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/hotels", "/api/hotels/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/hotels", "/api/hotels/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/rooms", "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rooms", "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/rooms", "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms", "/api/rooms/**").permitAll()

                        .requestMatchers(HttpMethod.GET,
                                "/api/cities/**",
                                "/api/hotel-chains/**",
                                "/api/room-types/**",
                                "/api/room-amenities",
                                "/api/room-amenities/**",
                                "/api/hotel-amenities/**",
                                "/api/services/**",
                                "/api/room-policies/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/users/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/{id}").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/users/{id}").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/users/me").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/users/me/password").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/users/logout").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/reservations/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/reservations/{id}/confirm").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payments/create-intent").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payments/confirm/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/payments/status/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payments/cancel/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/users").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/reservations/stats/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/payments", "/api/payments/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/receipts", "/api/receipts/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/staff", "/api/staff/**").hasAnyRole("STAFF", "ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
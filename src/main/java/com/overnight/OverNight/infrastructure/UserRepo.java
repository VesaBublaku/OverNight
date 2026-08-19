package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndDeletedAtIsNull(String email);
    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    boolean existsByEmail(String email);
    boolean existsByEmailAndDeletedAtIsNull(String email);

    long countByDeletedAtIsNull();
    long countByIsActiveTrueAndDeletedAtIsNull();
}

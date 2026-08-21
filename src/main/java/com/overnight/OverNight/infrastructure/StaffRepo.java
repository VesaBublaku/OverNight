package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepo extends JpaRepository<Staff, Long> {

    Optional<Staff> findByEmailAndDeletedAtIsNull(String email);
    Optional<Staff> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT s FROM Staff s WHERE s.deletedAt IS NULL")
    List<Staff> findAllActiveStaff();

    boolean existsByEmailAndDeletedAtIsNull(String email);

    @Query("SELECT s FROM Staff s WHERE s.role = :role AND s.deletedAt IS NULL")
    List<Staff> findByRole(String role);

}
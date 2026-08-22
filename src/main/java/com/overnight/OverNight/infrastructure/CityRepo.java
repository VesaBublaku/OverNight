package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepo extends JpaRepository<City,Long> {

    Optional<City> findByNameAndDeletedAtIsNull(String name);
    Optional<City> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT c FROM City c WHERE c.deletedAt IS NULL")
    List<City> findAllActive();

    @Query("SELECT c FROM City c WHERE c.deletedAt IS NULL AND c.isActive = true")
    List<City> findAllActiveAndEnabled();

    boolean existsByNameAndDeletedAtIsNull(String name);
}

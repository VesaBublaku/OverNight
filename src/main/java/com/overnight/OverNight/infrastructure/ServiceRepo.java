package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepo extends JpaRepository<Service, Long> {

    Optional<Service> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT s FROM Service s WHERE s.deletedAt IS NULL")
    List<Service> findAllActive();

    @Query("SELECT s FROM Service s WHERE s.hotel.id = :hotelId AND s.deletedAt IS NULL ORDER BY s.displayOrder ASC")
    List<Service> findByHotelIdOrderByDisplayOrder(@Param("hotelId") Long hotelId);

    @Query("SELECT s FROM Service s WHERE s.hotel.id = :hotelId AND s.isActive = true AND s.deletedAt IS NULL ORDER BY s.displayOrder ASC")
    List<Service> findActiveByHotelIdOrderByDisplayOrder(@Param("hotelId") Long hotelId);

    @Query("SELECT s FROM Service s WHERE s.description LIKE %:keyword% AND s.deletedAt IS NULL")
    List<Service> searchByDescription(@Param("keyword") String keyword);

    @Query("SELECT s FROM Service s WHERE s.isActive = true AND s.deletedAt IS NULL ORDER BY s.displayOrder ASC")
    List<Service> findAllActiveServices();
}
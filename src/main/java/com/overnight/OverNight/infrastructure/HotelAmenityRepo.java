package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.HotelAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HotelAmenityRepo extends JpaRepository<HotelAmenity, Long> {

    Optional<HotelAmenity> findByNameAndDeletedAtIsNull(String name);

    Optional<HotelAmenity> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT ha FROM HotelAmenity ha WHERE ha.deletedAt IS NULL")
    List<HotelAmenity> findAllActive();

    @Query("SELECT ha FROM HotelAmenity ha WHERE ha.deletedAt IS NULL AND ha.isActive = true")
    List<HotelAmenity> findAllActiveAndEnabled();

    @Query("SELECT ha FROM HotelAmenity ha WHERE ha.name LIKE %:keyword% AND ha.deletedAt IS NULL")
    List<HotelAmenity> searchByName(@Param("keyword") String keyword);

    @Query("SELECT ha FROM HotelAmenity ha WHERE ha.id IN :ids AND ha.deletedAt IS NULL")
    List<HotelAmenity> findByIds(@Param("ids") List<Long> ids);

    boolean existsByNameAndDeletedAtIsNull(String name);

    @Query("SELECT ha FROM HotelAmenity ha JOIN ha.hotels h WHERE h.id = :hotelId AND ha.deletedAt IS NULL")
    List<HotelAmenity> findByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT ha FROM HotelAmenity ha JOIN ha.hotels h WHERE h.id = :hotelId AND ha.isActive = true AND ha.deletedAt IS NULL")
    List<HotelAmenity> findActiveByHotelId(@Param("hotelId") Long hotelId);
}
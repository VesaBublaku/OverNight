package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepo extends JpaRepository<RoomType, Long> {

    Optional<RoomType> findByNameAndDeletedAtIsNull(String name);

    Optional<RoomType> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT rt FROM RoomType rt WHERE rt.deletedAt IS NULL")
    List<RoomType> findAllActive();

    @Query("SELECT rt FROM RoomType rt WHERE rt.deletedAt IS NULL AND rt.isActive = true")
    List<RoomType> findAllActiveAndEnabled();

    @Query("SELECT rt FROM RoomType rt WHERE rt.hotel.id = :hotelId AND rt.deletedAt IS NULL")
    List<RoomType> findByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT rt FROM RoomType rt WHERE rt.hotel.id = :hotelId AND rt.isActive = true AND rt.deletedAt IS NULL")
    List<RoomType> findActiveByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT rt FROM RoomType rt WHERE rt.name LIKE %:keyword% AND rt.deletedAt IS NULL")
    List<RoomType> searchByName(@Param("keyword") String keyword);

    @Query("SELECT rt FROM RoomType rt WHERE rt.maxOccupancy >= :occupancy AND rt.deletedAt IS NULL")
    List<RoomType> findByMaxOccupancyGreaterThanEqual(@Param("occupancy") Integer occupancy);

    boolean existsByNameAndDeletedAtIsNull(String name);
}
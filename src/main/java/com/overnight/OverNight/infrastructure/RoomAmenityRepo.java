package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.RoomAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomAmenityRepo extends JpaRepository<RoomAmenity, Long> {

    Optional<RoomAmenity> findByNameAndDeletedAtIsNull(String name);

    Optional<RoomAmenity> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT ra FROM RoomAmenity ra WHERE ra.deletedAt IS NULL")
    List<RoomAmenity> findAllActive();

    @Query("SELECT ra FROM RoomAmenity ra WHERE ra.deletedAt IS NULL AND ra.isActive = true")
    List<RoomAmenity> findAllActiveAndEnabled();

    @Query("SELECT ra FROM RoomAmenity ra WHERE ra.name LIKE %:keyword% AND ra.deletedAt IS NULL")
    List<RoomAmenity> searchByName(@Param("keyword") String keyword);

    @Query("SELECT ra FROM RoomAmenity ra WHERE ra.id IN :ids AND ra.deletedAt IS NULL")
    List<RoomAmenity> findByIds(@Param("ids") List<Long> ids);

    @Query("SELECT ra FROM RoomAmenity ra JOIN ra.rooms r WHERE r.id = :roomId AND ra.deletedAt IS NULL")
    List<RoomAmenity> findByRoomId(@Param("roomId") Long roomId);

    @Query("SELECT ra FROM RoomAmenity ra JOIN ra.rooms r WHERE r.id = :roomId AND ra.isActive = true AND ra.deletedAt IS NULL")
    List<RoomAmenity> findActiveByRoomId(@Param("roomId") Long roomId);

    boolean existsByNameAndDeletedAtIsNull(String name);
}
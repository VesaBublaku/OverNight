package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {

    Optional<Room> findByIdAndDeletedAtIsNull(Long id);

    Optional<Room> findByRoomNumberAndDeletedAtIsNull(String roomNumber);

    @Query("SELECT r FROM Room r WHERE r.deletedAt IS NULL")
    List<Room> findAllActive();

    @Query("SELECT r FROM Room r WHERE r.deletedAt IS NULL AND r.isActive = true")
    List<Room> findAllActiveAndEnabled();

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.deletedAt IS NULL")
    List<Room> findByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.isActive = true AND r.deletedAt IS NULL")
    List<Room> findActiveByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT r FROM Room r WHERE r.roomType.id = :roomTypeId AND r.deletedAt IS NULL")
    List<Room> findByRoomTypeId(@Param("roomTypeId") Long roomTypeId);

    @Query("SELECT r FROM Room r WHERE r.capacity >= :capacity AND r.deletedAt IS NULL")
    List<Room> findByCapacityGreaterThanEqual(@Param("capacity") Integer capacity);

    @Query("SELECT r FROM Room r WHERE r.price <= :maxPrice AND r.deletedAt IS NULL")
    List<Room> findByPriceLessThanEqual(@Param("maxPrice") Double maxPrice);

    @Query("SELECT r FROM Room r WHERE r.isExtendable = true AND r.deletedAt IS NULL")
    List<Room> findExtendableRooms();

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.capacity >= :capacity AND r.deletedAt IS NULL")
    List<Room> findByHotelIdAndCapacity(@Param("hotelId") Long hotelId, @Param("capacity") Integer capacity);

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.price <= :maxPrice AND r.deletedAt IS NULL")
    List<Room> findByHotelIdAndMaxPrice(@Param("hotelId") Long hotelId, @Param("maxPrice") Double maxPrice);

    @Query("SELECT r FROM Room r JOIN r.roomAmenities a WHERE a.id = :amenityId AND r.deletedAt IS NULL")
    List<Room> findByAmenityId(@Param("amenityId") Long amenityId);

    @Query("SELECT r FROM Room r WHERE r.roomNumber LIKE %:keyword% AND r.deletedAt IS NULL")
    List<Room> searchByRoomNumber(@Param("keyword") String keyword);
}
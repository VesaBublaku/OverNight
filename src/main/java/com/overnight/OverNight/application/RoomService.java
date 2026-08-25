package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.*;
import com.overnight.OverNight.infrastructure.RoomRepo;
import com.overnight.OverNight.infrastructure.HotelRepo;
import com.overnight.OverNight.infrastructure.RoomTypeRepo;
import com.overnight.OverNight.infrastructure.RoomAmenityRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepo roomRepo;
    private final HotelRepo hotelRepo;
    private final RoomTypeRepo roomTypeRepo;
    private final RoomAmenityRepo roomAmenityRepo;

    @Transactional
    public Room createRoom(Room room) {
        if (room.getHotel() == null || room.getHotel().getId() == null) {
            throw new RuntimeException("Hotel is required");
        }

        Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(room.getHotel().getId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + room.getHotel().getId()));
        room.setHotel(hotel);

        if (room.getRoomType() != null && room.getRoomType().getId() != null) {
            RoomType roomType = roomTypeRepo.findByIdAndDeletedAtIsNull(room.getRoomType().getId())
                    .orElseThrow(() -> new RuntimeException("Room type not found with id: " + room.getRoomType().getId()));
            room.setRoomType(roomType);
        }

        if (room.getRoomAmenities() != null && !room.getRoomAmenities().isEmpty()) {
            List<RoomAmenity> resolvedAmenities = new ArrayList<>();
            for (RoomAmenity amenity : room.getRoomAmenities()) {
                if (amenity.getId() != null) {
                    RoomAmenity resolved = roomAmenityRepo.findByIdAndDeletedAtIsNull(amenity.getId())
                            .orElseThrow(() -> new RuntimeException("Room amenity not found with id: " + amenity.getId()));
                    resolvedAmenities.add(resolved);
                }
            }
            room.setRoomAmenities(resolvedAmenities);
        }

        if (room.getIsActive() == null) {
            room.setIsActive(true);
        }
        return roomRepo.save(room);
    }

    @Transactional(readOnly = true)
    public List<Room> getAllRooms() {
        return roomRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<Room> getActiveRooms() {
        return roomRepo.findAllActiveAndEnabled();
    }

    @Transactional(readOnly = true)
    public Room getRoomById(Long id) {
        return roomRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Room getRoomByNumber(String roomNumber) {
        return roomRepo.findByRoomNumberAndDeletedAtIsNull(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found with number: " + roomNumber));
    }

    @Transactional
    public Room updateRoom(Long id, Room updatedRoom) {
        Room room = getRoomById(id);

        if (updatedRoom.getRoomNumber() != null) {
            room.setRoomNumber(updatedRoom.getRoomNumber());
        }
        if (updatedRoom.getPrice() != null) {
            room.setPrice(updatedRoom.getPrice());
        }
        if (updatedRoom.getCapacity() != null) {
            room.setCapacity(updatedRoom.getCapacity());
        }
        if (updatedRoom.getIsExtendable() != null) {
            room.setIsExtendable(updatedRoom.getIsExtendable());
        }
        if (updatedRoom.getConditionNote() != null) {
            room.setConditionNote(updatedRoom.getConditionNote());
        }
        if (updatedRoom.getImageUrl() != null) {
            room.setImageUrl(updatedRoom.getImageUrl());
        }
        if (updatedRoom.getRoomType() != null && updatedRoom.getRoomType().getId() != null) {
            RoomType roomType = roomTypeRepo.findByIdAndDeletedAtIsNull(updatedRoom.getRoomType().getId())
                    .orElseThrow(() -> new RuntimeException("Room type not found"));
            room.setRoomType(roomType);
        }
        if (updatedRoom.getHotel() != null && updatedRoom.getHotel().getId() != null) {
            Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(updatedRoom.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            room.setHotel(hotel);
        }
        if (updatedRoom.getRoomAmenities() != null) {
            List<RoomAmenity> resolvedAmenities = new ArrayList<>();
            for (RoomAmenity amenity : updatedRoom.getRoomAmenities()) {
                if (amenity.getId() != null) {
                    RoomAmenity resolved = roomAmenityRepo.findByIdAndDeletedAtIsNull(amenity.getId())
                            .orElseThrow(() -> new RuntimeException("Room amenity not found with id: " + amenity.getId()));
                    resolvedAmenities.add(resolved);
                }
            }
            room.setRoomAmenities(resolvedAmenities);
        }

        return roomRepo.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        room.setDeletedAt(LocalDateTime.now());
        room.setIsActive(false);
        roomRepo.save(room);
    }

    @Transactional
    public void activateRoom(Long id) {
        Room room = getRoomById(id);
        room.setIsActive(true);
        roomRepo.save(room);
    }

    @Transactional
    public void deactivateRoom(Long id) {
        Room room = getRoomById(id);
        room.setIsActive(false);
        roomRepo.save(room);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepo.findActiveByHotelId(hotelId);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByRoomType(Long roomTypeId) {
        return roomRepo.findByRoomTypeId(roomTypeId);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByCapacity(Integer capacity) {
        return roomRepo.findByCapacityGreaterThanEqual(capacity);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByMaxPrice(Double maxPrice) {
        return roomRepo.findByPriceLessThanEqual(maxPrice);
    }

    @Transactional(readOnly = true)
    public List<Room> getExtendableRooms() {
        return roomRepo.findExtendableRooms();
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByHotelAndCapacity(Long hotelId, Integer capacity) {
        return roomRepo.findByHotelIdAndCapacity(hotelId, capacity);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByHotelAndMaxPrice(Long hotelId, Double maxPrice) {
        return roomRepo.findByHotelIdAndMaxPrice(hotelId, maxPrice);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByAmenity(Long amenityId) {
        return roomRepo.findByAmenityId(amenityId);
    }

    @Transactional(readOnly = true)
    public List<Room> searchRooms(String keyword) {
        return roomRepo.searchByRoomNumber(keyword);
    }

    @Transactional
    public Room addAmenityToRoom(Long roomId, Long amenityId) {
        Room room = getRoomById(roomId);
        RoomAmenity amenity = roomAmenityRepo.findByIdAndDeletedAtIsNull(amenityId)
                .orElseThrow(() -> new RuntimeException("Room amenity not found with id: " + amenityId));

        if (!room.getRoomAmenities().contains(amenity)) {
            room.getRoomAmenities().add(amenity);
        }
        return roomRepo.save(room);
    }

    @Transactional
    public Room removeAmenityFromRoom(Long roomId, Long amenityId) {
        Room room = getRoomById(roomId);
        RoomAmenity amenity = roomAmenityRepo.findByIdAndDeletedAtIsNull(amenityId)
                .orElseThrow(() -> new RuntimeException("Room amenity not found with id: " + amenityId));

        room.getRoomAmenities().remove(amenity);
        return roomRepo.save(room);
    }

    @Transactional(readOnly = true)
    public boolean existsByRoomNumber(String roomNumber) {
        return roomRepo.findByRoomNumberAndDeletedAtIsNull(roomNumber).isPresent();
    }

    @Transactional(readOnly = true)
    public long countRoomsByHotel(Long hotelId) {
        return roomRepo.findActiveByHotelId(hotelId).size();
    }
}
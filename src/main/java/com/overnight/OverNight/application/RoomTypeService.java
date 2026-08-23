package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.Hotel;
import com.overnight.OverNight.domain.RoomType;
import com.overnight.OverNight.infrastructure.RoomTypeRepo;
import com.overnight.OverNight.infrastructure.HotelRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepo roomTypeRepo;
    private final HotelRepo hotelRepo;

    @Transactional
    public RoomType createRoomType(RoomType roomType) {
        if (roomTypeRepo.existsByNameAndDeletedAtIsNull(roomType.getName())) {
            throw new RuntimeException("Room type '" + roomType.getName() + "' already exists");
        }

        if (roomType.getHotel() != null && roomType.getHotel().getId() != null) {
            Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(roomType.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + roomType.getHotel().getId()));
            roomType.setHotel(hotel);
        }

        roomType.setIsActive(true);
        return roomTypeRepo.save(roomType);
    }

    @Transactional(readOnly = true)
    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<RoomType> getActiveRoomTypes() {
        return roomTypeRepo.findAllActiveAndEnabled();
    }

    @Transactional(readOnly = true)
    public RoomType getRoomTypeById(Long id) {
        return roomTypeRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Room type not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public RoomType getRoomTypeByName(String name) {
        return roomTypeRepo.findByNameAndDeletedAtIsNull(name)
                .orElseThrow(() -> new RuntimeException("Room type not found with name: " + name));
    }

    @Transactional
    public RoomType updateRoomType(Long id, RoomType updatedRoomType) {
        RoomType roomType = getRoomTypeById(id);

        if (updatedRoomType.getName() != null) {
            RoomType existing = roomTypeRepo.findByNameAndDeletedAtIsNull(updatedRoomType.getName()).orElse(null);
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("Room type '" + updatedRoomType.getName() + "' already exists");
            }
            roomType.setName(updatedRoomType.getName());
        }
        if (updatedRoomType.getDescription() != null) {
            roomType.setDescription(updatedRoomType.getDescription());
        }
        if (updatedRoomType.getBasePrice() != null) {
            roomType.setBasePrice(updatedRoomType.getBasePrice());
        }
        if (updatedRoomType.getMaxOccupancy() != null) {
            roomType.setMaxOccupancy(updatedRoomType.getMaxOccupancy());
        }
        if (updatedRoomType.getIcon() != null) {
            roomType.setIcon(updatedRoomType.getIcon());
        }
        if (updatedRoomType.getHotel() != null && updatedRoomType.getHotel().getId() != null) {
            Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(updatedRoomType.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            roomType.setHotel(hotel);
        }

        return roomTypeRepo.save(roomType);
    }

    @Transactional
    public void deleteRoomType(Long id) {
        RoomType roomType = getRoomTypeById(id);
        roomType.setDeletedAt(LocalDateTime.now());
        roomType.setIsActive(false);
        roomTypeRepo.save(roomType);
    }

    @Transactional
    public void activateRoomType(Long id) {
        RoomType roomType = getRoomTypeById(id);
        roomType.setIsActive(true);
        roomTypeRepo.save(roomType);
    }

    @Transactional
    public void deactivateRoomType(Long id) {
        RoomType roomType = getRoomTypeById(id);
        roomType.setIsActive(false);
        roomTypeRepo.save(roomType);
    }

    @Transactional(readOnly = true)
    public List<RoomType> getRoomTypesByHotel(Long hotelId) {
        return roomTypeRepo.findActiveByHotelId(hotelId);
    }

    @Transactional(readOnly = true)
    public List<RoomType> getRoomTypesByMinOccupancy(Integer occupancy) {
        return roomTypeRepo.findByMaxOccupancyGreaterThanEqual(occupancy);
    }

    @Transactional(readOnly = true)
    public List<RoomType> searchRoomTypes(String keyword) {
        return roomTypeRepo.searchByName(keyword);
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return roomTypeRepo.existsByNameAndDeletedAtIsNull(name);
    }

    @Transactional(readOnly = true)
    public long countRoomTypesByHotel(Long hotelId) {
        return roomTypeRepo.findActiveByHotelId(hotelId).size();
    }
}
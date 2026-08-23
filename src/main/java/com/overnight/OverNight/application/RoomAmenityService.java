package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.RoomAmenity;
import com.overnight.OverNight.infrastructure.RoomAmenityRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomAmenityService {

    private final RoomAmenityRepo roomAmenityRepo;

    @Transactional
    public RoomAmenity createRoomAmenity(RoomAmenity amenity) {
        if (roomAmenityRepo.existsByNameAndDeletedAtIsNull(amenity.getName())) {
            throw new RuntimeException("Room amenity '" + amenity.getName() + "' already exists");
        }
        amenity.setIsActive(true);
        return roomAmenityRepo.save(amenity);
    }

    @Transactional(readOnly = true)
    public List<RoomAmenity> getAllRoomAmenities() {
        return roomAmenityRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<RoomAmenity> getActiveRoomAmenities() {
        return roomAmenityRepo.findAllActiveAndEnabled();
    }

    @Transactional(readOnly = true)
    public RoomAmenity getRoomAmenityById(Long id) {
        return roomAmenityRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Room amenity not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public RoomAmenity getRoomAmenityByName(String name) {
        return roomAmenityRepo.findByNameAndDeletedAtIsNull(name)
                .orElseThrow(() -> new RuntimeException("Room amenity not found with name: " + name));
    }

    @Transactional
    public RoomAmenity updateRoomAmenity(Long id, RoomAmenity updatedAmenity) {
        RoomAmenity amenity = getRoomAmenityById(id);

        if (updatedAmenity.getName() != null) {
            RoomAmenity existing = roomAmenityRepo.findByNameAndDeletedAtIsNull(updatedAmenity.getName()).orElse(null);
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("Room amenity '" + updatedAmenity.getName() + "' already exists");
            }
            amenity.setName(updatedAmenity.getName());
        }
        if (updatedAmenity.getDescription() != null) {
            amenity.setDescription(updatedAmenity.getDescription());
        }

        return roomAmenityRepo.save(amenity);
    }

    @Transactional
    public void deleteRoomAmenity(Long id) {
        RoomAmenity amenity = getRoomAmenityById(id);
        amenity.setDeletedAt(LocalDateTime.now());
        amenity.setIsActive(false);
        roomAmenityRepo.save(amenity);
    }

    @Transactional
    public void activateRoomAmenity(Long id) {
        RoomAmenity amenity = getRoomAmenityById(id);
        amenity.setIsActive(true);
        roomAmenityRepo.save(amenity);
    }

    @Transactional
    public void deactivateRoomAmenity(Long id) {
        RoomAmenity amenity = getRoomAmenityById(id);
        amenity.setIsActive(false);
        roomAmenityRepo.save(amenity);
    }

    @Transactional(readOnly = true)
    public List<RoomAmenity> getAmenitiesByRoom(Long roomId) {
        return roomAmenityRepo.findActiveByRoomId(roomId);
    }

    @Transactional(readOnly = true)
    public List<RoomAmenity> searchRoomAmenities(String keyword) {
        return roomAmenityRepo.searchByName(keyword);
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return roomAmenityRepo.existsByNameAndDeletedAtIsNull(name);
    }

    @Transactional(readOnly = true)
    public List<RoomAmenity> getAmenitiesByIds(List<Long> ids) {
        return roomAmenityRepo.findByIds(ids);
    }
}
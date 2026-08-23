package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.Hotel;
import com.overnight.OverNight.domain.HotelAmenity;
import com.overnight.OverNight.infrastructure.HotelAmenityRepo;
import com.overnight.OverNight.infrastructure.HotelRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelAmenityService {

    private final HotelAmenityRepo hotelAmenityRepo;
    private final HotelRepo hotelRepo;

    @Transactional
    public HotelAmenity createHotelAmenity(HotelAmenity amenity) {
        if (hotelAmenityRepo.existsByNameAndDeletedAtIsNull(amenity.getName())) {
            throw new RuntimeException("Hotel amenity '" + amenity.getName() + "' already exists");
        }
        amenity.setIsActive(true);
        return hotelAmenityRepo.save(amenity);
    }

    @Transactional(readOnly = true)
    public List<HotelAmenity> getAllHotelAmenities() {
        return hotelAmenityRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<HotelAmenity> getActiveHotelAmenities() {
        return hotelAmenityRepo.findAllActiveAndEnabled();
    }

    @Transactional(readOnly = true)
    public HotelAmenity getHotelAmenityById(Long id) {
        return hotelAmenityRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Hotel amenity not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public HotelAmenity getHotelAmenityByName(String name) {
        return hotelAmenityRepo.findByNameAndDeletedAtIsNull(name)
                .orElseThrow(() -> new RuntimeException("Hotel amenity not found with name: " + name));
    }

    @Transactional
    public HotelAmenity updateHotelAmenity(Long id, HotelAmenity updatedAmenity) {
        HotelAmenity amenity = getHotelAmenityById(id);

        if (updatedAmenity.getName() != null) {
            HotelAmenity existing = hotelAmenityRepo.findByNameAndDeletedAtIsNull(updatedAmenity.getName()).orElse(null);
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("Hotel amenity '" + updatedAmenity.getName() + "' already exists");
            }
            amenity.setName(updatedAmenity.getName());
        }
        if (updatedAmenity.getDescription() != null) {
            amenity.setDescription(updatedAmenity.getDescription());
        }

        return hotelAmenityRepo.save(amenity);
    }

    @Transactional
    public void deleteHotelAmenity(Long id) {
        HotelAmenity amenity = getHotelAmenityById(id);
        amenity.setDeletedAt(LocalDateTime.now());
        amenity.setIsActive(false);
        hotelAmenityRepo.save(amenity);
    }

    @Transactional
    public void activateHotelAmenity(Long id) {
        HotelAmenity amenity = getHotelAmenityById(id);
        amenity.setIsActive(true);
        hotelAmenityRepo.save(amenity);
    }

    @Transactional
    public void deactivateHotelAmenity(Long id) {
        HotelAmenity amenity = getHotelAmenityById(id);
        amenity.setIsActive(false);
        hotelAmenityRepo.save(amenity);
    }

    @Transactional
    public void addAmenityToHotel(Long hotelId, Long amenityId) {
        Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + hotelId));
        HotelAmenity amenity = getHotelAmenityById(amenityId);

        if (!hotel.getHotelAmenities().contains(amenity)) {
            hotel.getHotelAmenities().add(amenity);
            hotelRepo.save(hotel);
        }
    }

    @Transactional
    public void removeAmenityFromHotel(Long hotelId, Long amenityId) {
        Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + hotelId));
        HotelAmenity amenity = getHotelAmenityById(amenityId);

        hotel.getHotelAmenities().remove(amenity);
        hotelRepo.save(hotel);
    }

    @Transactional(readOnly = true)
    public List<HotelAmenity> getAmenitiesByHotel(Long hotelId) {
        return hotelAmenityRepo.findActiveByHotelId(hotelId);
    }

    @Transactional(readOnly = true)
    public List<HotelAmenity> searchHotelAmenities(String keyword) {
        return hotelAmenityRepo.searchByName(keyword);
    }
}
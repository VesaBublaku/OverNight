package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.*;
import com.overnight.OverNight.infrastructure.HotelRepo;
import com.overnight.OverNight.infrastructure.CityRepo;
import com.overnight.OverNight.infrastructure.HotelChainRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepo hotelRepo;
    private final CityRepo cityRepo;
    private final HotelChainRepo hotelChainRepo;

    @Transactional
    public Hotel createHotel(Hotel hotel) {
        if (hotelRepo.existsByNameAndDeletedAtIsNull(hotel.getName())) {
            throw new RuntimeException("Hotel with name '" + hotel.getName() + "' already exists");
        }

        if (hotel.getCity() != null && hotel.getCity().getId() != null) {
            City city = cityRepo.findByIdAndDeletedAtIsNull(hotel.getCity().getId())
                    .orElseThrow(() -> new RuntimeException("City not found with id: " + hotel.getCity().getId()));
            hotel.setCity(city);
        }

        if (hotel.getHotelChain() != null && hotel.getHotelChain().getId() != null) {
            HotelChain chain = hotelChainRepo.findByIdAndDeletedAtIsNull(hotel.getHotelChain().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel chain not found with id: " + hotel.getHotelChain().getId()));
            hotel.setHotelChain(chain);
        }

        hotel.setIsActive(true);
        return hotelRepo.save(hotel);
    }

    @Transactional(readOnly = true)
    public List<Hotel> getAllHotels() {
        return hotelRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<Hotel> getActiveHotels() {
        return hotelRepo.findAllActiveAndEnabled();
    }

    @Transactional(readOnly = true)
    public Hotel getHotelById(Long id) {
        return hotelRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Hotel getHotelByName(String name) {
        return hotelRepo.findByNameAndDeletedAtIsNull(name)
                .orElseThrow(() -> new RuntimeException("Hotel not found with name: " + name));
    }

    @Transactional
    public Hotel updateHotel(Long id, Hotel updatedHotel) {
        Hotel hotel = getHotelById(id);

        if (updatedHotel.getName() != null) {
            Hotel existing = hotelRepo.findByNameAndDeletedAtIsNull(updatedHotel.getName()).orElse(null);
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("Hotel with name '" + updatedHotel.getName() + "' already exists");
            }
            hotel.setName(updatedHotel.getName());
        }
        if (updatedHotel.getCity() != null && updatedHotel.getCity().getId() != null) {
            City city = cityRepo.findByIdAndDeletedAtIsNull(updatedHotel.getCity().getId())
                    .orElseThrow(() -> new RuntimeException("City not found"));
            hotel.setCity(city);
        }
        if (updatedHotel.getChain() != null) {
            hotel.setChain(updatedHotel.getChain());
        }
        if (updatedHotel.getRating() != null) {
            hotel.setRating(updatedHotel.getRating());
        }
        if (updatedHotel.getAddress() != null) {
            hotel.setAddress(updatedHotel.getAddress());
        }
        if (updatedHotel.getEmail() != null) {
            hotel.setEmail(updatedHotel.getEmail());
        }
        if (updatedHotel.getImageUrl() != null) {
            hotel.setImageUrl(updatedHotel.getImageUrl());
        }
        if (updatedHotel.getDescription() != null) {
            hotel.setDescription(updatedHotel.getDescription());
        }
        if (updatedHotel.getCheckIn() != null) {
            hotel.setCheckIn(updatedHotel.getCheckIn());
        }
        if (updatedHotel.getCheckOut() != null) {
            hotel.setCheckOut(updatedHotel.getCheckOut());
        }
        if (updatedHotel.getHotelChain() != null && updatedHotel.getHotelChain().getId() != null) {
            HotelChain chain = hotelChainRepo.findByIdAndDeletedAtIsNull(updatedHotel.getHotelChain().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel chain not found"));
            hotel.setHotelChain(chain);
        }

        return hotelRepo.save(hotel);
    }

    @Transactional
    public void deleteHotel(Long id) {
        Hotel hotel = getHotelById(id);
        hotel.setDeletedAt(LocalDateTime.now());
        hotel.setIsActive(false);
        hotelRepo.save(hotel);
    }

    @Transactional
    public void activateHotel(Long id) {
        Hotel hotel = getHotelById(id);
        hotel.setIsActive(true);
        hotelRepo.save(hotel);
    }

    @Transactional
    public void deactivateHotel(Long id) {
        Hotel hotel = getHotelById(id);
        hotel.setIsActive(false);
        hotelRepo.save(hotel);
    }

    @Transactional(readOnly = true)
    public List<Hotel> getHotelsByCity(Long cityId) {
        return hotelRepo.findActiveByCityId(cityId);
    }

    @Transactional(readOnly = true)
    public List<Hotel> getHotelsByCityName(String cityName) {
        return hotelRepo.findByCityName(cityName);
    }

    @Transactional(readOnly = true)
    public List<Hotel> getHotelsByChain(String chain) {
        return hotelRepo.findByChain(chain);
    }

    @Transactional(readOnly = true)
    public List<Hotel> getHotelsByRating(Integer rating) {
        return hotelRepo.findByRatingGreaterThanEqual(rating);
    }

    @Transactional(readOnly = true)
    public List<Hotel> getHotelsByHotelChain(Long chainId) {
        return hotelRepo.findByHotelChainId(chainId);
    }

    @Transactional(readOnly = true)
    public List<Hotel> searchHotels(String keyword) {
        return hotelRepo.searchByName(keyword);
    }

    @Transactional(readOnly = true)
    public List<String> getAllChains() {
        return hotelRepo.findAllDistinctChains();
    }

    @Transactional
    public Hotel addAmenityToHotel(Long hotelId, HotelAmenity amenity) {
        Hotel hotel = getHotelById(hotelId);
        if (!hotel.getHotelAmenities().contains(amenity)) {
            hotel.getHotelAmenities().add(amenity);
        }
        return hotelRepo.save(hotel);
    }

    @Transactional
    public Hotel removeAmenityFromHotel(Long hotelId, HotelAmenity amenity) {
        Hotel hotel = getHotelById(hotelId);
        hotel.getHotelAmenities().remove(amenity);
        return hotelRepo.save(hotel);
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return hotelRepo.existsByNameAndDeletedAtIsNull(name);
    }
}
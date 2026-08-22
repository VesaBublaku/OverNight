package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.City;
import com.overnight.OverNight.infrastructure.CityRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CityService {

    private final CityRepo cityRepo;

    @Transactional
    public City createCity(City city) {
        if (cityRepo.existsByNameAndDeletedAtIsNull(city.getName())) {
            throw new RuntimeException("City '" + city.getName() + "' already exists");
        }
        city.setIsActive(true);
        return cityRepo.save(city);
    }

    @Transactional(readOnly = true)
    public List<City> getAllCities() {
        return cityRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<City> getActiveCities() {
        return cityRepo.findAllActiveAndEnabled();
    }

    @Transactional(readOnly = true)
    public City getCityById(Long id) {
        return cityRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public City getCityByName(String name) {
        return cityRepo.findByNameAndDeletedAtIsNull(name)
                .orElseThrow(() -> new RuntimeException("City not found with name: " + name));
    }

    @Transactional
    public City updateCity(Long id, City updatedCity) {
        City city = getCityById(id);

        if (updatedCity.getName() != null) {
            // Check if name is taken
            City existing = cityRepo.findByNameAndDeletedAtIsNull(updatedCity.getName()).orElse(null);
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("City '" + updatedCity.getName() + "' already exists");
            }
            city.setName(updatedCity.getName());
        }
        if (updatedCity.getCountry() != null) {
            city.setCountry(updatedCity.getCountry());
        }

        return cityRepo.save(city);
    }

    @Transactional
    public void deleteCity(Long id) {
        City city = getCityById(id);
        city.setDeletedAt(LocalDateTime.now());
        city.setIsActive(false);
        cityRepo.save(city);
    }

    @Transactional
    public void activateCity(Long id) {
        City city = getCityById(id);
        city.setIsActive(true);
        cityRepo.save(city);
    }

    @Transactional
    public void deactivateCity(Long id) {
        City city = getCityById(id);
        city.setIsActive(false);
        cityRepo.save(city);
    }
}
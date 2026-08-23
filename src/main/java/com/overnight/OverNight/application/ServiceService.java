package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.Hotel;
import com.overnight.OverNight.domain.Service;
import com.overnight.OverNight.infrastructure.ServiceRepo;
import com.overnight.OverNight.infrastructure.HotelRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepo serviceRepo;
    private final HotelRepo hotelRepo;

    @Transactional
    public Service createService(Service service) {
        if (service.getHotel() != null && service.getHotel().getId() != null) {
            Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(service.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + service.getHotel().getId()));
            service.setHotel(hotel);
        }

        service.setIsActive(true);
        return serviceRepo.save(service);
    }

    @Transactional(readOnly = true)
    public List<Service> getAllServices() {
        return serviceRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<Service> getActiveServices() {
        return serviceRepo.findAllActiveServices();
    }

    @Transactional(readOnly = true)
    public Service getServiceById(Long id) {
        return serviceRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Service> getServicesByHotel(Long hotelId) {
        return serviceRepo.findActiveByHotelIdOrderByDisplayOrder(hotelId);
    }

    @Transactional
    public Service updateService(Long id, Service updatedService) {
        Service service = getServiceById(id);

        if (updatedService.getDescription() != null) {
            service.setDescription(updatedService.getDescription());
        }
        if (updatedService.getDisplayOrder() != null) {
            service.setDisplayOrder(updatedService.getDisplayOrder());
        }
        if (updatedService.getHotel() != null && updatedService.getHotel().getId() != null) {
            Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(updatedService.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            service.setHotel(hotel);
        }

        return serviceRepo.save(service);
    }

    @Transactional
    public void deleteService(Long id) {
        Service service = getServiceById(id);
        service.setDeletedAt(LocalDateTime.now());
        service.setIsActive(false);
        serviceRepo.save(service);
    }

    @Transactional
    public void activateService(Long id) {
        Service service = getServiceById(id);
        service.setIsActive(true);
        serviceRepo.save(service);
    }

    @Transactional
    public void deactivateService(Long id) {
        Service service = getServiceById(id);
        service.setIsActive(false);
        serviceRepo.save(service);
    }

    @Transactional(readOnly = true)
    public List<Service> searchServices(String keyword) {
        return serviceRepo.searchByDescription(keyword);
    }

    @Transactional(readOnly = true)
    public long countServicesByHotel(Long hotelId) {
        return serviceRepo.findActiveByHotelIdOrderByDisplayOrder(hotelId).size();
    }

    @Transactional
    public Service reorderService(Long id, Integer newOrder) {
        Service service = getServiceById(id);
        service.setDisplayOrder(newOrder);
        return serviceRepo.save(service);
    }
}
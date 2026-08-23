package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.HotelChain;
import com.overnight.OverNight.infrastructure.HotelChainRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelChainService {

    private final HotelChainRepo hotelChainRepo;

    @Transactional
    public HotelChain createHotelChain(HotelChain hotelChain) {
        if (hotelChainRepo.existsByNameAndDeletedAtIsNull(hotelChain.getName())) {
            throw new RuntimeException("Hotel chain with name '" + hotelChain.getName() + "' already exists");
        }
        hotelChain.setIsActive(true);
        return hotelChainRepo.save(hotelChain);
    }

    @Transactional(readOnly = true)
    public List<HotelChain> getAllHotelChains() {
        return hotelChainRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<HotelChain> getActiveHotelChains() {
        return hotelChainRepo.findAllActiveAndEnabled();
    }

    @Transactional(readOnly = true)
    public HotelChain getHotelChainById(Long id) {
        return hotelChainRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Hotel chain not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public HotelChain getHotelChainByName(String name) {
        return hotelChainRepo.findByNameAndDeletedAtIsNull(name)
                .orElseThrow(() -> new RuntimeException("Hotel chain not found with name: " + name));
    }

    @Transactional(readOnly = true)
    public HotelChain getHotelChainByHotelId(Long hotelId) {
        return hotelChainRepo.findByHotelId(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel chain not found for hotel id: " + hotelId));
    }

    @Transactional
    public HotelChain updateHotelChain(Long id, HotelChain updatedChain) {
        HotelChain chain = getHotelChainById(id);

        if (updatedChain.getName() != null) {
            HotelChain existing = hotelChainRepo.findByNameAndDeletedAtIsNull(updatedChain.getName()).orElse(null);
            if (existing != null && !existing.getId().equals(id)) {
                throw new RuntimeException("Hotel chain with name '" + updatedChain.getName() + "' already exists");
            }
            chain.setName(updatedChain.getName());
        }
        if (updatedChain.getDescription() != null) {
            chain.setDescription(updatedChain.getDescription());
        }
        if (updatedChain.getImageUrl() != null) {
            chain.setImageUrl(updatedChain.getImageUrl());
        }
        if (updatedChain.getHotelCount() != null) {
            chain.setHotelCount(updatedChain.getHotelCount());
        }

        return hotelChainRepo.save(chain);
    }

    @Transactional
    public void deleteHotelChain(Long id) {
        HotelChain chain = getHotelChainById(id);
        chain.setDeletedAt(LocalDateTime.now());
        chain.setIsActive(false);
        hotelChainRepo.save(chain);
    }

    @Transactional
    public void activateHotelChain(Long id) {
        HotelChain chain = getHotelChainById(id);
        chain.setIsActive(true);
        hotelChainRepo.save(chain);
    }

    @Transactional
    public void deactivateHotelChain(Long id) {
        HotelChain chain = getHotelChainById(id);
        chain.setIsActive(false);
        hotelChainRepo.save(chain);
    }

    @Transactional(readOnly = true)
    public List<HotelChain> searchHotelChains(String keyword) {
        return hotelChainRepo.searchByName(keyword);
    }

    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return hotelChainRepo.existsByNameAndDeletedAtIsNull(name);
    }

    @Transactional(readOnly = true)
    public long getTotalChains() {
        return hotelChainRepo.countActive();
    }

    @Transactional
    public HotelChain incrementHotelCount(Long id) {
        HotelChain chain = getHotelChainById(id);
        chain.setHotelCount((chain.getHotelCount() != null ? chain.getHotelCount() : 0) + 1);
        return hotelChainRepo.save(chain);
    }

    @Transactional
    public HotelChain decrementHotelCount(Long id) {
        HotelChain chain = getHotelChainById(id);
        int currentCount = chain.getHotelCount() != null ? chain.getHotelCount() : 0;
        chain.setHotelCount(Math.max(0, currentCount - 1));
        return hotelChainRepo.save(chain);
    }
}
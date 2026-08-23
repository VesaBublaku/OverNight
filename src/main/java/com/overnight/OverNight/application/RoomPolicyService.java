package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.Hotel;
import com.overnight.OverNight.domain.RoomPolicy;
import com.overnight.OverNight.infrastructure.RoomPolicyRepo;
import com.overnight.OverNight.infrastructure.HotelRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomPolicyService {

    private final RoomPolicyRepo roomPolicyRepo;
    private final HotelRepo hotelRepo;

    @Transactional
    public RoomPolicy createRoomPolicy(RoomPolicy policy) {
        // Validate and set Hotel
        if (policy.getHotel() != null && policy.getHotel().getId() != null) {
            Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(policy.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + policy.getHotel().getId()));
            policy.setHotel(hotel);
        }

        policy.setIsActive(true);
        return roomPolicyRepo.save(policy);
    }

    @Transactional(readOnly = true)
    public List<RoomPolicy> getAllPolicies() {
        return roomPolicyRepo.findAllActive();
    }

    @Transactional(readOnly = true)
    public List<RoomPolicy> getActivePolicies() {
        return roomPolicyRepo.findAllActivePolicies();
    }

    @Transactional(readOnly = true)
    public RoomPolicy getPolicyById(Long id) {
        return roomPolicyRepo.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new RuntimeException("Policy not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<RoomPolicy> getPoliciesByHotel(Long hotelId) {
        return roomPolicyRepo.findActiveByHotelIdOrderByDisplayOrder(hotelId);
    }

    @Transactional(readOnly = true)
    public List<RoomPolicy> getPoliciesByHotelAndType(Long hotelId, String policyType) {
        return roomPolicyRepo.findByHotelIdAndPolicyType(hotelId, policyType);
    }

    @Transactional(readOnly = true)
    public List<RoomPolicy> getPoliciesByType(String policyType) {
        return roomPolicyRepo.findByPolicyType(policyType);
    }

    @Transactional
    public RoomPolicy updateRoomPolicy(Long id, RoomPolicy updatedPolicy) {
        RoomPolicy policy = getPolicyById(id);

        if (updatedPolicy.getPolicyType() != null) {
            policy.setPolicyType(updatedPolicy.getPolicyType());
        }
        if (updatedPolicy.getTitle() != null) {
            policy.setTitle(updatedPolicy.getTitle());
        }
        if (updatedPolicy.getDescription() != null) {
            policy.setDescription(updatedPolicy.getDescription());
        }
        if (updatedPolicy.getDisplayOrder() != null) {
            policy.setDisplayOrder(updatedPolicy.getDisplayOrder());
        }
        if (updatedPolicy.getHotel() != null && updatedPolicy.getHotel().getId() != null) {
            Hotel hotel = hotelRepo.findByIdAndDeletedAtIsNull(updatedPolicy.getHotel().getId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            policy.setHotel(hotel);
        }

        return roomPolicyRepo.save(policy);
    }

    @Transactional
    public void deleteRoomPolicy(Long id) {
        RoomPolicy policy = getPolicyById(id);
        policy.setDeletedAt(LocalDateTime.now());
        policy.setIsActive(false);
        roomPolicyRepo.save(policy);
    }

    @Transactional
    public void activatePolicy(Long id) {
        RoomPolicy policy = getPolicyById(id);
        policy.setIsActive(true);
        roomPolicyRepo.save(policy);
    }

    @Transactional
    public void deactivatePolicy(Long id) {
        RoomPolicy policy = getPolicyById(id);
        policy.setIsActive(false);
        roomPolicyRepo.save(policy);
    }

    @Transactional(readOnly = true)
    public long countPoliciesByHotel(Long hotelId) {
        return roomPolicyRepo.findActiveByHotelIdOrderByDisplayOrder(hotelId).size();
    }

    @Transactional(readOnly = true)
    public List<String> getAllPolicyTypes() {
        return List.of("CHECK_IN", "CHECK_OUT", "CANCELLATION", "PETS", "CHILDREN", "SMOKING", "PARTIES");
    }
}
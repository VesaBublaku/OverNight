package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.RoomPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomPolicyRepo extends JpaRepository<RoomPolicy, Long> {

    Optional<RoomPolicy> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT rp FROM RoomPolicy rp WHERE rp.deletedAt IS NULL")
    List<RoomPolicy> findAllActive();

    @Query("SELECT rp FROM RoomPolicy rp WHERE rp.hotel.id = :hotelId AND rp.deletedAt IS NULL")
    List<RoomPolicy> findByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT rp FROM RoomPolicy rp WHERE rp.hotel.id = :hotelId AND rp.isActive = true AND rp.deletedAt IS NULL ORDER BY rp.displayOrder ASC")
    List<RoomPolicy> findActiveByHotelIdOrderByDisplayOrder(@Param("hotelId") Long hotelId);

    @Query("SELECT rp FROM RoomPolicy rp WHERE rp.hotel.id = :hotelId AND rp.policyType = :policyType AND rp.deletedAt IS NULL")
    List<RoomPolicy> findByHotelIdAndPolicyType(@Param("hotelId") Long hotelId, @Param("policyType") String policyType);

    @Query("SELECT rp FROM RoomPolicy rp WHERE rp.policyType = :policyType AND rp.deletedAt IS NULL")
    List<RoomPolicy> findByPolicyType(@Param("policyType") String policyType);

    @Query("SELECT rp FROM RoomPolicy rp WHERE rp.isActive = true AND rp.deletedAt IS NULL")
    List<RoomPolicy> findAllActivePolicies();
}
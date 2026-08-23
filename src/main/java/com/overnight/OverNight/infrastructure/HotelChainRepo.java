package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.HotelChain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HotelChainRepo extends JpaRepository<HotelChain, Long> {

    Optional<HotelChain> findByNameAndDeletedAtIsNull(String name);

    Optional<HotelChain> findByIdAndDeletedAtIsNull(Long id);

    @Query("SELECT hc FROM HotelChain hc WHERE hc.deletedAt IS NULL")
    List<HotelChain> findAllActive();

    @Query("SELECT hc FROM HotelChain hc WHERE hc.deletedAt IS NULL AND hc.isActive = true")
    List<HotelChain> findAllActiveAndEnabled();

    @Query("SELECT hc FROM HotelChain hc WHERE hc.name LIKE %:keyword% AND hc.deletedAt IS NULL")
    List<HotelChain> searchByName(@Param("keyword") String keyword);

    @Query("SELECT hc FROM HotelChain hc JOIN hc.hotels h WHERE h.id = :hotelId AND hc.deletedAt IS NULL")
    Optional<HotelChain> findByHotelId(@Param("hotelId") Long hotelId);

    @Query("SELECT COUNT(hc) FROM HotelChain hc WHERE hc.deletedAt IS NULL")
    long countActive();

    boolean existsByNameAndDeletedAtIsNull(String name);
}
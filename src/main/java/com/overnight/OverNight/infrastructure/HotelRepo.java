package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepo extends JpaRepository<Hotel, Long> {

    Optional<Hotel> findByIdAndDeletedAtIsNull(Long id);

    Optional<Hotel> findByNameAndDeletedAtIsNull(String name);

    @Query("SELECT h FROM Hotel h WHERE h.deletedAt IS NULL")
    List<Hotel> findAllActive();

    @Query("SELECT h FROM Hotel h WHERE h.deletedAt IS NULL AND h.isActive = true")
    List<Hotel> findAllActiveAndEnabled();

    @Query("SELECT h FROM Hotel h WHERE h.city.id = :cityId AND h.deletedAt IS NULL")
    List<Hotel> findByCityId(@Param("cityId") Long cityId);

    @Query("SELECT h FROM Hotel h WHERE h.city.id = :cityId AND h.isActive = true AND h.deletedAt IS NULL")
    List<Hotel> findActiveByCityId(@Param("cityId") Long cityId);

    @Query("SELECT h FROM Hotel h WHERE h.chain = :chain AND h.deletedAt IS NULL")
    List<Hotel> findByChain(@Param("chain") String chain);

    @Query("SELECT h FROM Hotel h WHERE h.rating >= :rating AND h.deletedAt IS NULL")
    List<Hotel> findByRatingGreaterThanEqual(@Param("rating") Integer rating);

    @Query("SELECT h FROM Hotel h WHERE h.hotelChain.id = :chainId AND h.deletedAt IS NULL")
    List<Hotel> findByHotelChainId(@Param("chainId") Long chainId);

    @Query("SELECT h FROM Hotel h WHERE h.name LIKE %:keyword% AND h.deletedAt IS NULL")
    List<Hotel> searchByName(@Param("keyword") String keyword);

    @Query("SELECT h FROM Hotel h WHERE h.city.name = :cityName AND h.deletedAt IS NULL")
    List<Hotel> findByCityName(@Param("cityName") String cityName);

    @Query("SELECT DISTINCT h.chain FROM Hotel h WHERE h.deletedAt IS NULL")
    List<String> findAllDistinctChains();

    boolean existsByNameAndDeletedAtIsNull(String name);
}
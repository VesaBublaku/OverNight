package com.overnight.OverNight.infrastructure;

import com.overnight.OverNight.domain.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepo extends JpaRepository<ActivityLog, Long> {

    @Query("SELECT a FROM ActivityLog a ORDER BY a.timestamp DESC")
    List<ActivityLog> findAllOrderByTimestampDesc();

    @Query("SELECT a FROM ActivityLog a WHERE a.user.id = :userId ORDER BY a.timestamp DESC")
    List<ActivityLog> findByUserIdOrderByTimestampDesc(@Param("userId") Long userId);

    @Query("SELECT a FROM ActivityLog a WHERE a.staff.id = :staffId ORDER BY a.timestamp DESC")
    List<ActivityLog> findByStaffIdOrderByTimestampDesc(@Param("staffId") Long staffId);

    @Query("SELECT a FROM ActivityLog a WHERE a.action = :action ORDER BY a.timestamp DESC")
    List<ActivityLog> findByActionOrderByTimestampDesc(@Param("action") String action);

    @Query("SELECT a FROM ActivityLog a WHERE a.entityType = :entityType ORDER BY a.timestamp DESC")
    List<ActivityLog> findByEntityTypeOrderByTimestampDesc(@Param("entityType") String entityType);

    @Query("SELECT a FROM ActivityLog a WHERE a.entityId = :entityId ORDER BY a.timestamp DESC")
    List<ActivityLog> findByEntityIdOrderByTimestampDesc(@Param("entityId") Long entityId);

    @Query("SELECT a FROM ActivityLog a WHERE a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    List<ActivityLog> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT a FROM ActivityLog a WHERE a.timestamp >= :startDate ORDER BY a.timestamp DESC")
    List<ActivityLog> findFromDate(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(a) FROM ActivityLog a WHERE a.action = :action")
    long countByAction(@Param("action") String action);

    @Query("SELECT COUNT(a) FROM ActivityLog a WHERE a.entityType = :entityType")
    long countByEntityType(@Param("entityType") String entityType);
}
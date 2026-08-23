package com.overnight.OverNight.application;

import com.overnight.OverNight.domain.ActivityLog;
import com.overnight.OverNight.domain.Staff;
import com.overnight.OverNight.domain.User;
import com.overnight.OverNight.infrastructure.ActivityLogRepo;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepo activityLogRepo;

    @Transactional
    public void log(String action, String entityType, Long entityId, String details) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());

        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            log.setUser((User) auth.getPrincipal());
        } else if (auth != null && auth.getPrincipal() instanceof Staff) {
            log.setStaff((Staff) auth.getPrincipal());
        }

        activityLogRepo.save(log);
    }

    @Transactional
    public void logWithIp(String action, String entityType, Long entityId, String details, HttpServletRequest request) {
        ActivityLog log = new ActivityLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());
        log.setIpAddress(getClientIp(request));

        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            log.setUser((User) auth.getPrincipal());
        } else if (auth != null && auth.getPrincipal() instanceof Staff) {
            log.setStaff((Staff) auth.getPrincipal());
        }

        activityLogRepo.save(log);
    }

    @Transactional
    public void logLogin(User user, HttpServletRequest request) {
        logWithIp("LOGIN", "USER", user.getId(), "User logged in: " + user.getEmail(), request);
    }

    @Transactional
    public void logLogin(Staff staff, HttpServletRequest request) {
        logWithIp("LOGIN", "STAFF", staff.getId(), "Staff logged in: " + staff.getEmail(), request);
    }

    @Transactional
    public void logLogout(User user) {
        log("LOGOUT", "USER", user.getId(), "User logged out: " + user.getEmail());
    }

    @Transactional
    public void logLogout(Staff staff) {
        log("LOGOUT", "STAFF", staff.getId(), "Staff logged out: " + staff.getEmail());
    }

    @Transactional
    public void logCreate(String entityType, Long entityId, String details) {
        log("CREATE", entityType, entityId, details);
    }

    @Transactional
    public void logUpdate(String entityType, Long entityId, String details) {
        log("UPDATE", entityType, entityId, details);
    }

    @Transactional
    public void logDelete(String entityType, Long entityId, String details) {
        log("DELETE", entityType, entityId, details);
    }

    @Transactional
    public void logView(String entityType, Long entityId, String details) {
        log("VIEW", entityType, entityId, details);
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getAllLogs() {
        return activityLogRepo.findAllOrderByTimestampDesc();
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getLogsByUser(Long userId) {
        return activityLogRepo.findByUserIdOrderByTimestampDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getLogsByStaff(Long staffId) {
        return activityLogRepo.findByStaffIdOrderByTimestampDesc(staffId);
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getLogsByAction(String action) {
        return activityLogRepo.findByActionOrderByTimestampDesc(action);
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getLogsByEntityType(String entityType) {
        return activityLogRepo.findByEntityTypeOrderByTimestampDesc(entityType);
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getLogsByEntityId(Long entityId) {
        return activityLogRepo.findByEntityIdOrderByTimestampDesc(entityId);
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return activityLogRepo.findByDateRange(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<ActivityLog> getLogsFromDate(LocalDateTime startDate) {
        return activityLogRepo.findFromDate(startDate);
    }

    @Transactional(readOnly = true)
    public long countByAction(String action) {
        return activityLogRepo.countByAction(action);
    }

    @Transactional(readOnly = true)
    public long countByEntityType(String entityType) {
        return activityLogRepo.countByEntityType(entityType);
    }

    @Transactional
    public void deleteLogsOlderThan(LocalDateTime date) {
        List<ActivityLog> oldLogs = activityLogRepo.findFromDate(date);
        activityLogRepo.deleteAll(oldLogs);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
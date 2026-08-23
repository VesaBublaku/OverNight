package com.overnight.OverNight.controller;

import com.overnight.OverNight.application.ActivityLogService;
import com.overnight.OverNight.domain.ActivityLog;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activity-logs")
@CrossOrigin(origins = {"http://localhost:4300"})
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getAllLogs() {
        return ResponseEntity.ok(activityLogService.getAllLogs());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(activityLogService.getLogsByUser(userId));
    }

    @GetMapping("/staff/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsByStaff(@PathVariable Long staffId) {
        return ResponseEntity.ok(activityLogService.getLogsByStaff(staffId));
    }

    @GetMapping("/action/{action}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsByAction(@PathVariable String action) {
        return ResponseEntity.ok(activityLogService.getLogsByAction(action));
    }

    @GetMapping("/entity-type/{entityType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsByEntityType(@PathVariable String entityType) {
        return ResponseEntity.ok(activityLogService.getLogsByEntityType(entityType));
    }

    @GetMapping("/entity/{entityId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsByEntityId(@PathVariable Long entityId) {
        return ResponseEntity.ok(activityLogService.getLogsByEntityId(entityId));
    }

    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(activityLogService.getLogsByDateRange(startDate, endDate));
    }

    @GetMapping("/from-date")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsFromDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate) {
        return ResponseEntity.ok(activityLogService.getLogsFromDate(startDate));
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsToday() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        return ResponseEntity.ok(activityLogService.getLogsFromDate(startOfDay));
    }

    @GetMapping("/this-week")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsThisWeek() {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);
        return ResponseEntity.ok(activityLogService.getLogsFromDate(startOfWeek));
    }

    @GetMapping("/this-month")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getLogsThisMonth() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return ResponseEntity.ok(activityLogService.getLogsFromDate(startOfMonth));
    }

    @GetMapping("/stats/action/{action}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countByAction(@PathVariable String action) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", activityLogService.countByAction(action));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/entity-type/{entityType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countByEntityType(@PathVariable String entityType) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", activityLogService.countByEntityType(entityType));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getTotalLogs() {
        Map<String, Long> response = new HashMap<>();
        response.put("total", (long) activityLogService.getAllLogs().size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countLogsByUser(@PathVariable Long userId) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", (long) activityLogService.getLogsByUser(userId).size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats/staff/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> countLogsByStaff(@PathVariable Long staffId) {
        Map<String, Long> response = new HashMap<>();
        response.put("count", (long) activityLogService.getLogsByStaff(staffId).size());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteLogsOlderThan(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        activityLogService.deleteLogsOlderThan(date);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logs older than " + date + " deleted successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cleanup/30-days")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteLogsOlderThan30Days() {
        LocalDateTime date = LocalDateTime.now().minusDays(30);
        activityLogService.deleteLogsOlderThan(date);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logs older than 30 days deleted successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cleanup/90-days")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteLogsOlderThan90Days() {
        LocalDateTime date = LocalDateTime.now().minusDays(90);
        activityLogService.deleteLogsOlderThan(date);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logs older than 90 days deleted successfully");
        return ResponseEntity.ok(response);
    }
}
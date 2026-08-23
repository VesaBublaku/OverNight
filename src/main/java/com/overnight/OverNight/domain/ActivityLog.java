package com.overnight.OverNight.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "activity_logs")
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Staff staff;

    private String action;
    private String entityType;
    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    private String ipAddress;
    private LocalDateTime timestamp;
}

package com.example.BudgetTracker.Budget.src.main.java.org.example.entity;

import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    private Long userId;
    private String category;
    private int month;
    private int year;

    private String alertType;   // WARNING / EXCEEDED
    private String message;

    @Column(name = "is_read")
    private boolean isRead=false;       // ✅ MUST MATCH DB

    private LocalDateTime createdAt;
}


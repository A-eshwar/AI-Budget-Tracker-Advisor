package com.example.BudgetTracker.savings.src.main.java.org.example.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saving_goal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long goalId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(name = "target_amount", nullable = false)
    private double targetAmount;

    // 🔥 DB DEFAULT (0.00)
    @Column(name = "saved_amount", insertable = false)
    private Double savedAmount;

    // 🔥 DB DEFAULT (0)
    @Column(insertable = false)
    private Boolean completed;

    // 🔥 DB DEFAULT (CURRENT_TIMESTAMP)
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
package com.example.BudgetTracker.savings.src.main.java.org.example.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavingGoalRequest {
    private Long userId;
    private String name;
    private double targetAmount;
}

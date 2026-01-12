package com.example.BudgetTracker.savings.src.main.java.org.example.dto;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SavingGoalResponse {

    private Long goalId;
    private String name;
    private double targetAmount;
    private double savedAmount;
    private double remainingAmount;
    private double progressPercentage;
    private boolean completed;
}
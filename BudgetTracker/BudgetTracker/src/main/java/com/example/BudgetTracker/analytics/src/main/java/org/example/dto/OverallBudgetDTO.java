package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OverallBudgetDTO {
    private Double totalBudget;
    private Double totalSpent;
}

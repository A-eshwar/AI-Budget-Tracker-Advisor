package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BudgetComparisonDTO {
    private String category;
    private double limitAmount;
    private double spentAmount;
}
package com.example.BudgetTracker.Budget.src.main.java.org.example.dto;

import lombok.Data;

@Data
public class BudgetResponse {
    private Long budgetId;
    private String category;
    private double limitAmount;
    private double actualExpense;
    private double usagePercentage;
    private String alertType;
    private String alertMessage;
}

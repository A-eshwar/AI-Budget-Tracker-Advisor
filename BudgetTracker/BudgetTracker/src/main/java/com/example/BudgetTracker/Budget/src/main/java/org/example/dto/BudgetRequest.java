package com.example.BudgetTracker.Budget.src.main.java.org.example.dto;

import lombok.Data;

@Data
public class BudgetRequest {
    private Long userId;
    private String category;
    private double limitAmount;
    private int budgetMonth;
    private int budgetYear;
}

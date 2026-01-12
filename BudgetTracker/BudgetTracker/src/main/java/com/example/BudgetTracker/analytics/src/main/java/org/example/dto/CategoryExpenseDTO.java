package com.example.BudgetTracker.analytics.src.main.java.org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryExpenseDTO {
    private String category;
    private double amount;
}
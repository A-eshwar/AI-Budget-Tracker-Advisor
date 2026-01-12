package com.example.BudgetTracker.Budget.src.main.java.org.example.service;

import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetRequest;
import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetResponse;

public interface BudgetService {

    void saveBudget(BudgetRequest request);

    BudgetResponse analyzeBudget(
            Long userId,
            String category,
            int month,
            int year
    );
    void updateBudget(Long budgetId, double limitAmount);
}

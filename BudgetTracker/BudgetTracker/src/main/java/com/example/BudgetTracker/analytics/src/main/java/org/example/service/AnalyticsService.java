package com.example.BudgetTracker.analytics.src.main.java.org.example.service;

import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.*;
import java.util.List;

public interface AnalyticsService {

    IncomeExpenseDTO getIncomeExpense(Long userId, int month, int year);

    List<CategoryExpenseDTO> getCategoryExpense(Long userId, int month, int year, String category);

    List<BudgetComparisonDTO> getBudgetVsSpent(Long userId, int month, int year);

    OverallBudgetDTO getOverallBudget(Long userId, int month, int year);
}
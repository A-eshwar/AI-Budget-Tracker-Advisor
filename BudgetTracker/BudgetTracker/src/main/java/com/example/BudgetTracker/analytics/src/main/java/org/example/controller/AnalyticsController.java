package com.example.BudgetTracker.analytics.src.main.java.org.example.controller;

import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.*;
import com.example.BudgetTracker.analytics.src.main.java.org.example.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/income-expense")
    public IncomeExpenseDTO incomeExpense(@RequestParam Long userId,
                                          @RequestParam int month,
                                          @RequestParam int year) {

        return analyticsService.getIncomeExpense(userId, month, year);
    }

    @GetMapping("/category-expense")
    public List<CategoryExpenseDTO> categoryExpense(@RequestParam Long userId,
                                                    @RequestParam int month,
                                                    @RequestParam int year,
                                                    @RequestParam(defaultValue = "All") String category) {

        return analyticsService.getCategoryExpense(userId, month, year, category);
    }
    @GetMapping("/budget-vs-spent")
    public List<BudgetComparisonDTO> budgetCompare(@RequestParam Long userId,
                                                   @RequestParam int month,
                                                   @RequestParam int year) {

        return analyticsService.getBudgetVsSpent(userId, month, year);
    }
    @GetMapping("/overall-budget")
    public ResponseEntity<OverallBudgetDTO> getOverallBudget(
            @RequestParam Long userId,
            @RequestParam int month,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(
                analyticsService.getOverallBudget(userId, month, year)
        );
    }
}

package com.example.BudgetTracker.analytics.src.main.java.org.example.service;

import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.TransactionType;
import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.*;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.repository.TransactionRepository;
import com.example.BudgetTracker.Budget.src.main.java.org.example.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    @Override
    public IncomeExpenseDTO getIncomeExpense(Long userId, int month, int year) {

        Double income = transactionRepository.sumByTypeAndMonth(userId, TransactionType.INCOME, month, year);
        Double expense = transactionRepository.sumByTypeAndMonth(userId, TransactionType.EXPENSE, month, year);;

        return new IncomeExpenseDTO(
                income == null ? 0.0 : income,
                expense == null ? 0.0 : expense
        );
    }

    @Override
    public List<CategoryExpenseDTO> getCategoryExpense(Long userId, int month, int year, String category) {

        if (category == null || category.equalsIgnoreCase("All")) {
            return transactionRepository.categoryWiseExpenseByMonth(userId, month, year);
        }

        return transactionRepository.categoryWiseExpenseByMonthAndCategory(
                userId, category, month, year
        );
    }

    @Override
    public List<BudgetComparisonDTO> getBudgetVsSpent(Long userId, int month, int year) {
        return budgetRepository.compareBudgetMonthly(userId, month, year);
    }
    @Override
    public OverallBudgetDTO getOverallBudget(Long userId, int month, int year) {

        Double totalBudget = budgetRepository.totalBudgetByMonth(userId, month, year);
        Double totalSpent = transactionRepository.totalSpentByMonth(userId, month, year);

        return new OverallBudgetDTO(
                totalBudget == null ? 0 : totalBudget,
                totalSpent == null ? 0 : totalSpent
        );
    }
}

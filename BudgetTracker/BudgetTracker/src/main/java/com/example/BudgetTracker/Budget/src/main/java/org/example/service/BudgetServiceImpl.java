package com.example.BudgetTracker.Budget.src.main.java.org.example.service;

import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetRequest;
import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetResponse;
import com.example.BudgetTracker.Budget.src.main.java.org.example.entity.Alert;
import com.example.BudgetTracker.Budget.src.main.java.org.example.entity.Budget;
import com.example.BudgetTracker.Budget.src.main.java.org.example.repository.AlertRepository;
import com.example.BudgetTracker.Budget.src.main.java.org.example.repository.BudgetRepository;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class    BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final AlertRepository alertRepository;

    public BudgetServiceImpl(
            BudgetRepository budgetRepository,
            TransactionRepository transactionRepository,
            AlertRepository alertRepository
    ) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.alertRepository = alertRepository;
    }

    @Override
    public void saveBudget(BudgetRequest request) {

        budgetRepository
                .findByUserIdAndCategoryAndBudgetMonthAndBudgetYear(
                        request.getUserId(),
                        request.getCategory(),
                        request.getBudgetMonth(),
                        request.getBudgetYear()
                )
                .ifPresent(b -> {
                    throw new RuntimeException("Budget already exists");
                });

        Budget budget = new Budget();
        budget.setUserId(request.getUserId());
        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setBudgetMonth(request.getBudgetMonth());
        budget.setBudgetYear(request.getBudgetYear());

        budgetRepository.save(budget);
    }

    @Override
    public BudgetResponse analyzeBudget(Long userId, String category, int month, int year) {

        Budget budget = budgetRepository
                .findByUserIdAndCategoryAndBudgetMonthAndBudgetYear(
                        userId, category, month, year
                )
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        Double expense =
                transactionRepository.totalExpenseByCategoryAndMonth(
                        userId, category, month, year
                );

        double spent = expense == null ? 0 : expense;
        double usage = (spent / budget.getLimitAmount()) * 100;

        BudgetResponse res = new BudgetResponse();
        res.setBudgetId(budget.getBudgetId());
        res.setCategory(category);
        res.setLimitAmount(budget.getLimitAmount());
        res.setActualExpense(spent);
        res.setUsagePercentage(usage);

        if (usage >= 100) {
            res.setAlertType("EXCEEDED");
            res.setAlertMessage("Budget exceeded");
        } else if (usage >= 80) {
            res.setAlertType("WARNING");
            res.setAlertMessage("80% budget used");
        } else {
            res.setAlertType("OK");
            res.setAlertMessage("Budget under control");
        }

        return res;
    }

    @Override
    public void updateBudget(Long budgetId, double limitAmount) {

        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (limitAmount <= 0) {
            throw new IllegalArgumentException("Budget limit must be greater than 0");
        }

        budget.setLimitAmount(limitAmount);
        budgetRepository.save(budget);

        // 4️⃣ Recalculate expense
        Double expense = transactionRepository.totalExpenseByCategoryAndMonth(
                budget.getUserId(),
                budget.getCategory(),
                budget.getBudgetMonth(),
                budget.getBudgetYear()
        );

        double spent = expense == null ? 0 : expense;
        double usage = (spent / limitAmount) * 100;

        // 5️⃣ Generate alert again if needed
        if (usage >= 80) {
            Alert alert = new Alert();
            alert.setUserId(budget.getUserId());
            alert.setCategory(budget.getCategory());
            alert.setMonth(budget.getBudgetMonth());
            alert.setYear(budget.getBudgetYear());
            alert.setCreatedAt(LocalDateTime.now());

            if (usage >= 100) {
                alert.setAlertType("EXCEEDED");
                alert.setMessage("Budget exceeded after update for " + budget.getCategory());
            } else {
                alert.setAlertType("WARNING");
                alert.setMessage("80% budget used after update for " + budget.getCategory());
            }

            alertRepository.save(alert);
        }
    }
}



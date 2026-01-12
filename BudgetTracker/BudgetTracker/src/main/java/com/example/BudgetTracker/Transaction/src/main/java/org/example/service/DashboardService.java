package com.example.BudgetTracker.Transaction.src.main.java.org.example.service;

import com.example.BudgetTracker.Transaction.src.main.java.org.example.dto.*;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository repo;

    public DashboardService(TransactionRepository repo) {
        this.repo = repo;
    }

    public DashboardResponse getSummary(Long userId) {

        Double income = repo.totalIncome(userId);
        Double expense = repo.totalExpense(userId);
        Long count = repo.countByUserId(userId);

        var recent = repo.findTop5ByUserIdOrderByTransactionDateDesc(userId)
                .stream()
                .map(t -> new TransactionMini(
                        t.getType().name(),
                        t.getCategory(),
                        t.getAmount()
                ))
                .collect(Collectors.toList());

        return new DashboardResponse(income, expense, count, recent);
    }
}

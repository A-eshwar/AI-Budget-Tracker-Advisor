package com.example.BudgetTracker.Transaction.src.main.java.org.example.dto;

import java.util.List;

public class DashboardResponse {

    private Double totalIncome;
    private Double totalExpense;
    private Double balance;
    private Long transactionCount;
    private List<TransactionMini> recentTransactions;

    public DashboardResponse(Double income, Double expense, Long count, List<TransactionMini> recent) {
        this.totalIncome = income;
        this.totalExpense = expense;
        this.balance = income - expense;
        this.transactionCount = count;
        this.recentTransactions = recent;
    }

    public Double getTotalIncome() { return totalIncome; }
    public Double getTotalExpense() { return totalExpense; }
    public Double getBalance() { return balance; }
    public Long getTransactionCount() { return transactionCount; }
    public List<TransactionMini> getRecentTransactions() { return recentTransactions; }
}

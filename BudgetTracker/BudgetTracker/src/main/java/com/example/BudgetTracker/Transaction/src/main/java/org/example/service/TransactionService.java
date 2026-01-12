package com.example.BudgetTracker.Transaction.src.main.java.org.example.service;

import com.example.BudgetTracker.Transaction.src.main.java.org.example.dto.TransactionRequest;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.Transaction;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.TransactionType;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.exception.TransactionException;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.repository.TransactionRepository;

import com.example.BudgetTracker.Budget.src.main.java.org.example.entity.Alert;
import com.example.BudgetTracker.Budget.src.main.java.org.example.repository.BudgetRepository;
import com.example.BudgetTracker.Budget.src.main.java.org.example.repository.AlertRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final AlertRepository alertRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            BudgetRepository budgetRepository,
            AlertRepository alertRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.alertRepository = alertRepository;
    }

    /* ---------------- ADD TRANSACTION ---------------- */

    public Transaction addTransaction(Long userId, TransactionRequest req) {

        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setType(req.getType());
        tx.setCategory(req.getCategory());
        tx.setAmount(req.getAmount());
        tx.setDescription(req.getDescription());
        tx.setTransactionDate(req.getTransactionDate());

        Transaction saved = transactionRepository.save(tx);

        // ✅ AUTO ALERT CHECK
        if (tx.getType() == TransactionType.EXPENSE) {
            generateBudgetAlert(tx);
        }

        return saved;
    }

    /* ---------------- ALERT LOGIC ---------------- */

    private void generateBudgetAlert(Transaction tx) {

        int month = tx.getTransactionDate().getMonthValue();
        int year = tx.getTransactionDate().getYear();

        budgetRepository
                .findByUserIdAndCategoryAndBudgetMonthAndBudgetYear(
                        tx.getUserId(),
                        tx.getCategory(),
                        month,
                        year
                )
                .ifPresent(budget -> {

                    Double spent = transactionRepository
                            .totalExpenseByCategoryAndMonth(
                                    tx.getUserId(),
                                    tx.getCategory(),
                                    month,
                                    year
                            );

                    double totalSpent = spent == null ? 0 : spent;
                    double usage = (totalSpent / budget.getLimitAmount()) * 100;

                    if (usage >= 80) {

                        Alert alert = new Alert();
                        alert.setUserId(tx.getUserId());
                        alert.setCategory(tx.getCategory());
                        alert.setMonth(month);
                        alert.setYear(year);
                        alert.setCreatedAt(LocalDateTime.now());
                        alert.setRead(false);

                        if (usage >= 100) {
                            alert.setAlertType("EXCEEDED");
                            alert.setMessage("Budget exceeded for " + tx.getCategory());
                        } else {
                            alert.setAlertType("WARNING");
                            alert.setMessage("80% budget used for " + tx.getCategory());
                        }

                        alertRepository.save(alert);
                    }
                });
    }

    /* ---------------- OTHER METHODS ---------------- */

    public List<Transaction> getUserTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
    }

    public Transaction updateTransaction(Long userId, Long id, TransactionRequest req) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new TransactionException("Transaction not found", HttpStatus.NOT_FOUND));

        tx.setType(req.getType());
        tx.setCategory(req.getCategory());
        tx.setAmount(req.getAmount());
        tx.setDescription(req.getDescription());
        tx.setTransactionDate(req.getTransactionDate());

        return transactionRepository.save(tx);
    }

    public void deleteTransaction(Long userId, Long id) {
        Transaction tx = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new TransactionException("Transaction not found", HttpStatus.NOT_FOUND));

        transactionRepository.delete(tx);
    }
}

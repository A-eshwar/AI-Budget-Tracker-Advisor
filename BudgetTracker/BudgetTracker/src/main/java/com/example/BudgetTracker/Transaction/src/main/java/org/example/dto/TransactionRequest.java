package com.example.BudgetTracker.Transaction.src.main.java.org.example.dto;

import java.time.LocalDate;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.TransactionType;
import lombok.Data;

@Data
public class TransactionRequest {

    private Long userId;
    private String category;
    private double amount;
    private TransactionType type;
    private String description;
    private LocalDate transactionDate;
}

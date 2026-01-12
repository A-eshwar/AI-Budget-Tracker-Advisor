package com.example.BudgetTracker.Transaction.src.main.java.org.example.dto;

import java.time.LocalDate;

public class TransactionResponse {

    private Long id;
    private String type;
    private String category;
    private Double amount;
    private String description;
    private LocalDate transactionDate;

    public TransactionResponse(Long id, String type, String category,
                               Double amount, String description, LocalDate date) {
        this.id = id;
        this.type = type;
        this.category = category;
        this.amount = amount;
        this.description = description;
        this.transactionDate = date;
    }

    // getters only
    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getCategory() {
        return category;
    }

    public Double getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }
}

package com.example.BudgetTracker.Transaction.src.main.java.org.example.dto;

public class TransactionMini {
    private String type;
    private String category;
    private Double amount;

    public TransactionMini(String type, String category, Double amount) {
        this.type = type;
        this.category = category;
        this.amount = amount;
    }

    public String getType() { return type; }
    public String getCategory() { return category; }
    public Double getAmount() { return amount; }
}

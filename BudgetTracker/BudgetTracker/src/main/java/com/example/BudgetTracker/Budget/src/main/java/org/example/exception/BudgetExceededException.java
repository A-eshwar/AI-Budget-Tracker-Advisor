package com.example.BudgetTracker.Budget.src.main.java.org.example.exception;

public class BudgetExceededException extends RuntimeException {

    public BudgetExceededException(String message) {
        super(message);
    }
}

package com.example.BudgetTracker.Budget.src.main.java.org.example.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(
        name = "budgets",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "category", "budget_month", "budget_year"}
        )
)
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")   // ✅ FIX
    private Long budgetId;

    @Column(name = "user_id")
    private Long userId;

    private String category;

    @Column(name = "limit_amount")
    private double limitAmount;

    @Column(name = "budget_month")
    private int budgetMonth;

    @Column(name = "budget_year")
    private int budgetYear;
}

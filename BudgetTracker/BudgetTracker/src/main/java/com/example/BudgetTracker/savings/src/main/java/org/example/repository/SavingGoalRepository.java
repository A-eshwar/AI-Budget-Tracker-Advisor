package com.example.BudgetTracker.savings.src.main.java.org.example.repository;

import com.example.BudgetTracker.savings.src.main.java.org.example.entity.SavingGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingGoalRepository extends JpaRepository<SavingGoal, Long> {
    List<SavingGoal> findByUserId(Long userId);
}
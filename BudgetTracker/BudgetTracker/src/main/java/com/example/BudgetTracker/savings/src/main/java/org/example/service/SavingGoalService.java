package com.example.BudgetTracker.savings.src.main.java.org.example.service;

import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalRequest;
import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalResponse;

import java.util.List;

public interface SavingGoalService {

    void createGoal(SavingGoalRequest request);

    List<SavingGoalResponse> getGoals(Long userId);
    void addSavings(Long goalId, double amount);
    void updateGoal(Long goalId, SavingGoalRequest request);

    void deleteGoal(Long goalId);
}

package com.example.BudgetTracker.savings.src.main.java.org.example.controller;

import lombok.RequiredArgsConstructor;
import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalRequest;
import com.example.BudgetTracker.savings.src.main.java.org.example.dto.SavingGoalResponse;
import com.example.BudgetTracker.savings.src.main.java.org.example.service.SavingGoalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SavingGoalController {

    private final SavingGoalService service;

    @PostMapping
    public void createGoal(@RequestBody SavingGoalRequest request) {
        service.createGoal(request);
    }

    @GetMapping
    public List<SavingGoalResponse> getGoals(@RequestParam Long userId) {
        return service.getGoals(userId);
    }

    @PutMapping("/{goalId}/add")
    public void addSavings(
            @PathVariable Long goalId,
            @RequestParam double amount
    ) {
        service.addSavings(goalId, amount);
    }
    @PutMapping("/{goalId}")
    public void updateGoal(
            @PathVariable Long goalId,
            @RequestBody SavingGoalRequest request
    ) {
        service.updateGoal(goalId, request);
    }

    @DeleteMapping("/{goalId}")
    public void deleteGoal(@PathVariable Long goalId) {
        service.deleteGoal(goalId);
    }
}

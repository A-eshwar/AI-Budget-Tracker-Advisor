package com.example.BudgetTracker.Budget.src.main.java.org.example.controller;

import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetRequest;
import com.example.BudgetTracker.Budget.src.main.java.org.example.dto.BudgetResponse;
import com.example.BudgetTracker.Budget.src.main.java.org.example.entity.Alert;
import com.example.BudgetTracker.Budget.src.main.java.org.example.repository.AlertRepository;
import com.example.BudgetTracker.Budget.src.main.java.org.example.service.BudgetService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin
public class BudgetController {

    private final BudgetService budgetService;
    private final AlertRepository alertRepository;

    public BudgetController(BudgetService budgetService,
                            AlertRepository alertRepository) {
        this.budgetService = budgetService;
        this.alertRepository = alertRepository;
    }

    /* ---------------- BUDGET ---------------- */

    @PostMapping
    public void saveBudget(@RequestBody BudgetRequest request) {
        budgetService.saveBudget(request);
    }

    @GetMapping("/analysis")
    public BudgetResponse analyze(
            @RequestParam Long userId,
            @RequestParam String category,
            @RequestParam int month,
            @RequestParam int year
    ) {
        return budgetService.analyzeBudget(userId, category, month, year);
    }

    @PutMapping("/{budgetId}")
    public void updateBudget(
            @PathVariable Long budgetId,
            @RequestParam double limitAmount
    ) {
        budgetService.updateBudget(budgetId, limitAmount);
    }

    /* ---------------- ALERTS ---------------- */

    // ✅ FETCH ALERTS
    @GetMapping("/alerts")
    public List<Alert> getAlerts(@RequestParam Long userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ✅ UNREAD ALERT COUNT (SIDEBAR BADGE)
    @GetMapping("/alerts/count")
    public long getAlertCount(@RequestParam Long userId) {
        return alertRepository.countByUserIdAndIsReadFalse(userId);
    }

    // ✅ MARK ALL ALERTS AS READ
    @PutMapping("/alerts/read")
    public void markAlertsRead(@RequestParam Long userId) {
        List<Alert> alerts =
                alertRepository.findByUserIdOrderByCreatedAtDesc(userId);

        alerts.forEach(alert -> alert.setRead(true));
        alertRepository.saveAll(alerts);
    }

    @DeleteMapping("/alerts/delete")
    public void deleteSelectedAlerts(
            @RequestParam Long userId,
            @RequestBody List<Long> alertIds
    ) {
        alertRepository.deleteSelectedAlerts(alertIds, userId);
    }

    @DeleteMapping("/alerts/delete/all")
    public void deleteAllAlerts(@RequestParam Long userId) {
        alertRepository.deleteAllAlerts(userId);
    }
}

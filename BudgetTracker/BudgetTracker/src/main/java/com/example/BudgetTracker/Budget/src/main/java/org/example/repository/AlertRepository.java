package com.example.BudgetTracker.Budget.src.main.java.org.example.repository;

import com.example.BudgetTracker.Budget.src.main.java.org.example.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    // 🔔 Fetch alerts
    List<Alert> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 🔢 Unread alert count (USED BY SIDEBAR BADGE)
    long countByUserIdAndIsReadFalse(Long userId);

    // ✅ DELETE SELECTED ALERTS
    @Modifying
    @Transactional
    @Query("DELETE FROM Alert a WHERE a.alertId IN :alertIds AND a.userId = :userId")
    void deleteSelectedAlerts(
            @Param("alertIds") List<Long> alertIds,
            @Param("userId") Long userId
    );

    // ✅ DELETE ALL ALERTS FOR USER
    @Modifying
    @Transactional
    @Query("DELETE FROM Alert a WHERE a.userId = :userId")
    void deleteAllAlerts(@Param("userId") Long userId);
}

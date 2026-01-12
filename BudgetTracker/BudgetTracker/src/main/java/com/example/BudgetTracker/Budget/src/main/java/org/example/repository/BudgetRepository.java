package com.example.BudgetTracker.Budget.src.main.java.org.example.repository;

import com.example.BudgetTracker.Budget.src.main.java.org.example.entity.Budget;
import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.BudgetComparisonDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserIdAndCategoryAndBudgetMonthAndBudgetYear(
            Long userId,
            String category,
            int budgetMonth,
            int budgetYear
    );
    @Query("""
        SELECT new com.example.BudgetTracker.analytics.src.main.java.org.example.dto.BudgetComparisonDTO(
           b.category,
           b.limitAmount,
           COALESCE(SUM(t.amount),0)
        )
        FROM Budget b
        LEFT JOIN Transaction t
          ON t.category = b.category
         AND t.userId = b.userId
         AND t.type = 'EXPENSE'
         AND MONTH(t.transactionDate) = :month
         AND YEAR(t.transactionDate) = :year
        WHERE b.userId = :userId
        GROUP BY b.category, b.limitAmount
    """)
    List<BudgetComparisonDTO> compareBudgetMonthly(@Param("userId") Long userId,
                                                   @Param("month") int month,
                                                   @Param("year") int year);
    @Query("""
SELECT COALESCE(SUM(b.limitAmount), 0)
FROM Budget b
WHERE b.userId = :userId
  AND b.budgetMonth = :month
  AND b.budgetYear = :year
""")
    Double totalBudgetByMonth(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year
    );
}

package com.example.BudgetTracker.Transaction.src.main.java.org.example.repository;

import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.Transaction;
import com.example.BudgetTracker.analytics.src.main.java.org.example.dto.CategoryExpenseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.TransactionType;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.userId = :userId AND t.type = :type
    """)
    Double totalAmountByType(
            @Param("userId") Long userId,
            @Param("type") TransactionType type
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount),0)
        FROM Transaction t
        WHERE t.userId = :userId AND t.type = 'INCOME'
    """)
    Double totalIncome(@Param("userId") Long userId);

    @Query("""
        SELECT COALESCE(SUM(t.amount),0)
        FROM Transaction t
        WHERE t.userId = :userId AND t.type = 'EXPENSE'
    """)
    Double totalExpense(@Param("userId") Long userId);

    @Query("""
        SELECT COALESCE(SUM(t.amount),0)
        FROM Transaction t
        WHERE t.userId = :userId AND t.type = 'SAVINGS'
    """)
    Double totalSavings(@Param("userId") Long userId);


    @Query("""
        SELECT COALESCE(SUM(t.amount),0)
        FROM Transaction t
        WHERE t.userId = :userId
          AND t.type = :type
          AND MONTH(t.transactionDate) = :month
          AND YEAR(t.transactionDate) = :year
    """)
    Double sumByTypeAndMonth(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("month") int month,
            @Param("year") int year
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.userId = :userId
          AND t.type = 'EXPENSE'
          AND t.category = :category
          AND MONTH(t.transactionDate) = :month
          AND YEAR(t.transactionDate) = :year
    """)
    Double totalExpenseByCategoryAndMonth(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("month") int month,
            @Param("year") int year
    );
    @Query("""
        SELECT new com.example.BudgetTracker.analytics.src.main.java.org.example.dto.CategoryExpenseDTO(
            t.category, COALESCE(SUM(t.amount),0)
        )
        FROM Transaction t
        WHERE t.userId = :userId
          AND t.type = 'EXPENSE'
          AND MONTH(t.transactionDate) = :month
          AND YEAR(t.transactionDate) = :year
        GROUP BY t.category
    """)
    List<CategoryExpenseDTO> categoryWiseExpenseByMonth(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year
    );

    @Query("""
    SELECT new com.example.BudgetTracker.analytics.src.main.java.org.example.dto.CategoryExpenseDTO(
        t.category, COALESCE(SUM(t.amount),0)
    )
    FROM Transaction t
    WHERE t.userId = :userId
      AND t.type = 'EXPENSE'
      AND t.category = :category
      AND MONTH(t.transactionDate) = :month
      AND YEAR(t.transactionDate) = :year
    GROUP BY t.category
""")
    List<CategoryExpenseDTO> categoryWiseExpenseByMonthAndCategory(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("month") int month,
            @Param("year") int year
    );
    @Query("""
SELECT COALESCE(SUM(t.amount),0)
FROM Transaction t
WHERE t.userId = :userId
  AND t.type = 'EXPENSE'
  AND MONTH(t.transactionDate) = :month
  AND YEAR(t.transactionDate) = :year
""")
    Double totalSpentByMonth(
            @Param("userId") Long userId,
            @Param("month") int month,
            @Param("year") int year
    );
    Long countByUserId(Long userId);

    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    List<Transaction> findTop5ByUserIdOrderByTransactionDateDesc(Long userId);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);
}
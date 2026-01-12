package com.example.BudgetTracker.Client.src.main.java.org.example.exception;

import com.example.BudgetTracker.Budget.src.main.java.org.example.exception.BudgetExceededException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice   // 🔄 better than @ControllerAdvice for REST APIs
public class GlobalExceptionHandler {

    /* ---------------- API EXCEPTION ---------------- */

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> handleApi(ApiException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(Map.of(
                        "status", "ERROR",
                        "message", ex.getMessage()
                ));
    }

    /* ---------------- BUDGET EXCEEDED ---------------- */

    @ExceptionHandler(BudgetExceededException.class)
    public ResponseEntity<Map<String, Object>> handleBudgetExceeded(
            BudgetExceededException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "status", "EXCEEDED",
                        "message", ex.getMessage()
                ));
    }

    /* ---------------- FALLBACK ---------------- */

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(
            RuntimeException ex
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "status", "FAILED",
                        "message", ex.getMessage()
                ));
    }
}

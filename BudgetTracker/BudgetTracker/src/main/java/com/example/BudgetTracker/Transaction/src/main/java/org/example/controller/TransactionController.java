package com.example.BudgetTracker.Transaction.src.main.java.org.example.controller;

import com.example.BudgetTracker.Transaction.src.main.java.org.example.dto.TransactionRequest;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.Transaction;
import com.example.BudgetTracker.Client.src.main.java.org.example.security.JwtUtils;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService service;
    private final JwtUtils jwtUtils;

    public TransactionController(TransactionService service, JwtUtils jwtUtils) {
        this.service = service;
        this.jwtUtils = jwtUtils;
    }

    private Long getUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized");
        }
        String token = authHeader.substring(7);
        return Long.parseLong(jwtUtils.getSubject(token));
    }

    @PostMapping
    public Transaction addTransaction(
            @RequestHeader("Authorization") String auth,
            @RequestBody TransactionRequest req) {

        Long userId = getUserId(auth);
        return service.addTransaction(userId, req);
    }

    @GetMapping
    public List<Transaction> getTransactions(
            @RequestHeader("Authorization") String auth) {

        Long userId = getUserId(auth);
        return service.getUserTransactions(userId);
    }

    // ✅ EDIT (FIXED)
    @PutMapping("/{id}")
    public Transaction updateTransaction(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id,
            @RequestBody TransactionRequest req) {

        Long userId = getUserId(auth);
        return service.updateTransaction(userId, id, req);
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(
            @RequestHeader("Authorization") String auth,
            @PathVariable Long id) {

        Long userId = getUserId(auth);
        service.deleteTransaction(userId, id);
    }
}



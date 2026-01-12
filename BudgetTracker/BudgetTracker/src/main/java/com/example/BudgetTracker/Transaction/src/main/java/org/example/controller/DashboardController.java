package com.example.BudgetTracker.Transaction.src.main.java.org.example.controller;

import com.example.BudgetTracker.Client.src.main.java.org.example.security.JwtUtils;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.Transaction;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.entity.TransactionType;
import com.example.BudgetTracker.Transaction.src.main.java.org.example.repository.TransactionRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    private final TransactionRepository transactionRepository;
    private final JwtUtils jwtUtils;

    public DashboardController(TransactionRepository transactionRepository,
                               JwtUtils jwtUtils) {
        this.transactionRepository = transactionRepository;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary(
            @RequestHeader("Authorization") String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        Long userId = Long.parseLong(jwtUtils.getSubject(token));

        Double income = transactionRepository
                .totalAmountByType(userId, TransactionType.INCOME);

        Double expense = transactionRepository
                .totalAmountByType(userId, TransactionType.EXPENSE);

        Long count = transactionRepository.countByUserId(userId);

        return Map.of(
                "totalIncome", income,
                "totalExpense", expense,
                "transactions", count,
                "balance", income - expense
        );
    }
    @GetMapping("/export/excel")
    public void exportExcel(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response
    ) throws IOException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        Long userId = Long.parseLong(jwtUtils.getSubject(token));

        response.setContentType("application/octet-stream");
        response.setHeader("Content-Disposition",
                "attachment; filename=transactions.xlsx");

        List<Transaction> list =
                transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Transactions");

        Row header = sheet.createRow(0);
        String[] cols = {"ID", "Date", "Category", "Amount", "Type", "Description"};

        for (int i = 0; i < cols.length; i++) {
            header.createCell(i).setCellValue(cols[i]);
        }

        int rowIdx = 1;
        for (Transaction t : list) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(t.getId());
            row.createCell(1).setCellValue(t.getTransactionDate().toString());
            row.createCell(2).setCellValue(t.getCategory());
            row.createCell(3).setCellValue(t.getAmount());
            row.createCell(4).setCellValue(t.getType().toString());
            row.createCell(5).setCellValue(t.getDescription());
        }

        ServletOutputStream out = response.getOutputStream();
        workbook.write(out);
        workbook.close();
        out.close();
    }

    // ================= EXPORT CSV =================

    @GetMapping("/export/csv")
    public void exportCSV(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse response
    ) throws IOException {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        Long userId = Long.parseLong(jwtUtils.getSubject(token));

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition",
                "attachment; filename=transactions.csv");

        List<Transaction> list =
                transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);

        PrintWriter writer = getPrintWriter(response, list);
        writer.close();
    }

    private static @NotNull PrintWriter getPrintWriter(HttpServletResponse response, List<Transaction> list) throws IOException {
        PrintWriter writer = response.getWriter();
        writer.println("ID,Date,Category,Amount,Type,Description");

        for (Transaction t : list) {
            writer.println(
                    t.getId() + "," +
                            t.getTransactionDate() + "," +
                            t.getCategory() + "," +
                            t.getAmount() + "," +
                            t.getType() + "," +
                            t.getDescription()
            );
        }

        writer.flush();
        return writer;
    }
}

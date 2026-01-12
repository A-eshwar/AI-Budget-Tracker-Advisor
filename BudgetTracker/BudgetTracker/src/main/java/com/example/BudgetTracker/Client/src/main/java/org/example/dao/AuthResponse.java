package com.example.BudgetTracker.Client.src.main.java.org.example.dao;

public class AuthResponse {
    private final String token;
    private final Long userId;
    private final String email;
    private final String name;

    public AuthResponse(String token, Long userId, String email, String name) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
    }
    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
}

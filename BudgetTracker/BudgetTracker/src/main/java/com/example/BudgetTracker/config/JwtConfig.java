package com.example.BudgetTracker.config;

import com.example.BudgetTracker.Client.src.main.java.org.example.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:replace_with_min32_chars_secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs:86400000}")
    private long jwtExpirationMs;

    @Bean
    public JwtUtils jwtUtils() {
        return new JwtUtils(jwtSecret, jwtExpirationMs);
    }
}

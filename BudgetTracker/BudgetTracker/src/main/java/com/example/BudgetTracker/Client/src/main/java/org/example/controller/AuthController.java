package com.example.BudgetTracker.Client.src.main.java.org.example.controller;

import com.example.BudgetTracker.Client.src.main.java.org.example.dao.*;
import com.example.BudgetTracker.Client.src.main.java.org.example.entity.User;
import com.example.BudgetTracker.Client.src.main.java.org.example.service.UserService;
import com.example.BudgetTracker.Client.src.main.java.org.example.security.JwtUtils;
import com.example.BudgetTracker.Client.src.main.java.org.example.exception.ApiException;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${client.origin:http://localhost:3000}")
@Validated
public class    AuthController {
    private final UserService userService;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignUpRequest req) {
        User saved = userService.register(req.getName(), req.getEmail(), req.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", saved.getId(), "email", saved.getEmail(), "name", saved.getName()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        User u = userService.authenticate(req.getEmail(), req.getPassword());
        String token = jwtUtils != null ? jwtUtils.generateToken(u.getId().toString()) : "no-jwt-configured";
        return ResponseEntity.ok(new AuthResponse(token, u.getId(), u.getEmail(), u.getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new ApiException("Missing Authorization header", HttpStatus.UNAUTHORIZED);
        }
        String token = auth.substring(7);
        if (!jwtUtils.validate(token)) {
            throw new ApiException("Invalid token", HttpStatus.UNAUTHORIZED);
        }
        String subject = jwtUtils.getSubject(token);
        return ResponseEntity.ok(Map.of("subject", subject));
    }
}

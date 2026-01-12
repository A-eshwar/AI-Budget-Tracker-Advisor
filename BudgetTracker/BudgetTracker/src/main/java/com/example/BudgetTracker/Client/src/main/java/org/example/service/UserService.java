package com.example.BudgetTracker.Client.src.main.java.org.example.service;

import com.example.BudgetTracker.Client.src.main.java.org.example.entity.User;
import com.example.BudgetTracker.Client.src.main.java.org.example.repository.UserRepository;
import com.example.BudgetTracker.Client.src.main.java.org.example.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String name, String email, String rawPassword) {
        if (userRepository.existsByEmail(email.toLowerCase().trim())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }
        User u = new User();
        u.setName(name);
        u.setEmail(email.toLowerCase().trim());
        u.setPasswordHash(passwordEncoder.encode(rawPassword));
        return userRepository.save(u);
    }
    public User authenticate(String email, String rawPassword) {
        Optional<User> maybe = userRepository.findByEmail(email.toLowerCase().trim());
        if (maybe.isEmpty()) {
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        User u = maybe.get();
        if (!passwordEncoder.matches(rawPassword, u.getPasswordHash())) {
            throw new ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
        return u;
    }
}

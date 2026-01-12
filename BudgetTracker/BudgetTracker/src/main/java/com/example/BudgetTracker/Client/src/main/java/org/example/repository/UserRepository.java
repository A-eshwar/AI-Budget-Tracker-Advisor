package com.example.BudgetTracker.Client.src.main.java.org.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.BudgetTracker.Client.src.main.java.org.example.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}

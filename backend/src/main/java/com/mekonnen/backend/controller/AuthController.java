package com.mekonnen.backend.controller;

import com.mekonnen.backend.dto.auth.AuthResponse;
import com.mekonnen.backend.dto.auth.LoginRequest;
import com.mekonnen.backend.dto.auth.RegisterRequest;
import com.mekonnen.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

// This controller exposes public authentication endpoints.
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register a new user.
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    // Log in an existing user.
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}

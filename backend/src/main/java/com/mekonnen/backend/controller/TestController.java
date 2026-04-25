package com.mekonnen.backend.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Temporary controller used only to test protected routes.
@RestController
public class TestController {

    // This endpoint should require a valid JWT.
    @GetMapping("/api/test/secure")
    public String secureEndpoint() {
        return "You have accessed a protected route successfully.";
    }
}

package com.mekonnen.backend.dto.auth;


// This DTO is returned after a successful register or login

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {

    // JWT token the frontend will store and send back on future requests.
    private String token;

    private Long userId;
    private String fullName;
    private String email;
    private String role;
}

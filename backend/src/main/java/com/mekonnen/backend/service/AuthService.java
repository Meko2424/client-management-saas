package com.mekonnen.backend.service;

import com.mekonnen.backend.dto.auth.AuthResponse;
import com.mekonnen.backend.dto.auth.LoginRequest;
import com.mekonnen.backend.dto.auth.RegisterRequest;
import com.mekonnen.backend.entity.Role;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.EmailAlreadyExistsException;
import com.mekonnen.backend.exception.InvalidCredentialsException;
import com.mekonnen.backend.repository.UserRepository;
import com.mekonnen.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

  // This service contains the business logic for registration and login
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
      this.userRepository = userRepository;
      this.passwordEncoder = passwordEncoder;
      this.jwtService = jwtService;
      this.authenticationManager = authenticationManager;
    }

    // Register a new user.
    public AuthResponse register(RegisterRequest request) {
      // Prevent duplicate emails.
      if (userRepository.existsByEmail(request.getEmail())) {
        throw new EmailAlreadyExistsException("Email is already in use");
      }

      // Create and populate a new user entity.
      User user = new User();
      user.setFullName(request.getFullName());
      user.setEmail(request.getEmail());
      user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
      user.setRole(Role.USER);

      // Save user in database.
      User savedUser = userRepository.save(user);

      // Generate JWT token for the new user.
      String token = jwtService.generateToken(savedUser.getEmail());

      // Return the token and some basic user info.
      return new AuthResponse(
              token,
              savedUser.getId(),
              savedUser.getFullName(),
              savedUser.getEmail(),
              savedUser.getRole().name()
      );
    }

    // Authenticate an existing user and return a token.
    public AuthResponse login(LoginRequest request) {
      try {
        // Let Spring Security validate email + password.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
      } catch (Exception ex) {
        throw new InvalidCredentialsException("Invalid email or password");
      }

      // Fetch the authenticated user from DB.
      User user = userRepository.findByEmail(request.getEmail())
              .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

      // Generate a fresh token.
      String token = jwtService.generateToken(user.getEmail());

      return new AuthResponse(
              token,
              user.getId(),
              user.getFullName(),
              user.getEmail(),
              user.getRole().name()
      );
    }

}

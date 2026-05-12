package com.mekonnen.backend.service;

import com.mekonnen.backend.dto.auth.ForgotPasswordRequest;
import com.mekonnen.backend.dto.auth.ResetPasswordRequest;
import com.mekonnen.backend.entity.PasswordResetToken;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.PasswordResetTokenRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;


// Handles forgot-password and reset-password business logic.
@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PasswordResetService(
            UserRepository userRepository,
            PasswordResetTokenRepository tokenRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Generate reset token if email exists.
    // Always return the same public message from controller for security.
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            PasswordResetToken resetToken = new PasswordResetToken();

            resetToken.setUser(user);
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));
            resetToken.setUsed(false);

            PasswordResetToken savedToken = tokenRepository.save(resetToken);

            // Local development only.
            // Later, I will replace this with real email sending.
            System.out.println("PASSWORD RESET LINK:");
//            System.out.println("http://localhost:3000/reset-password?token=" + savedToken.getToken());
            String resetLink =
                    "http://localhost:3000/reset-password?token=" + savedToken.getToken();

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    resetLink
            );

        });
    }

    // Reset password if token is valid, unused, and unexpired.
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired reset token"));

        if (resetToken.isUsed()) {
            throw new ResourceNotFoundException("Invalid or expired reset token");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Invalid or expired reset token");
        }

        User user = resetToken.getUser();

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        resetToken.setUsed(true);

        userRepository.save(user);
        tokenRepository.save(resetToken);
    }
}

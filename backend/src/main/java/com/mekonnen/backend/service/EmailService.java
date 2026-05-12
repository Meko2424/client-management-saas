package com.mekonnen.backend.service;

import com.mekonnen.backend.config.EmailProperties;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.stereotype.Service;

// Sends transactional emails using Resend.
@Service
public class EmailService {

    private final EmailProperties emailProperties;

    public EmailService(EmailProperties emailProperties) {
        this.emailProperties = emailProperties;
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        Resend resend = new Resend(emailProperties.getResendApiKey());

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(emailProperties.getFrom())
                .to(toEmail)
                .subject("Reset your Mini CRM password")
                .html("""
                        <h2>Reset your password</h2>
                        <p>Click the link below to reset your password:</p>
                        <p><a href="%s">Reset Password</a></p>
                        <p>This link will expire in 15 minutes.</p>
                        <p>If you did not request this, you can ignore this email.</p>
                        """.formatted(resetLink))
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
            System.out.println("Password reset email sent. Email ID: " + response.getId());
        } catch (ResendException ex) {
            throw new RuntimeException("Failed to send password reset email", ex);
        }
    }
}

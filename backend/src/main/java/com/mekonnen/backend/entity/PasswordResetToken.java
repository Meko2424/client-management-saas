package com.mekonnen.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// Stores temporary password reset tokens.
// Tokens expire and can only be used once.

@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User requesting password reset.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Random UUID token sent to the user.
    @Column(nullable = false, unique = true)
    private String token;

    // Expiration timestamp.
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    // Prevent token reuse.
    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}

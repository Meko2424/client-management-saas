package com.mekonnen.backend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// This entity maps to the clients table.
// Each client belongs to one authenticated user.
@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
public class Client {

    // Primary key for the clients table.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who owns this client.
    // Many clients can belong to one user.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Client name is required
    @Column(nullable = false)
    private String name;

    // Client email is optional
    @Column
    private String email;

    // Client phone is optional
    @Column
    private String phone;

    // Company name is optional
    @Column
    private String company;

    // Notes are optional and can be longer text.
    @Column(columnDefinition = "TEXT")
    private String notes;

    // Created timestamp comes from the database.
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Updated timestamp comes from the database for now.
    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;
}

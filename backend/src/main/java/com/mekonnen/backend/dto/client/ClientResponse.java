package com.mekonnen.backend.dto.client;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

// Response DTO returned to the frontend.
// We use DTOs so we do not expose the JPA entity directly.
@Getter
@AllArgsConstructor
public class ClientResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

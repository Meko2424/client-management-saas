package com.mekonnen.backend.dto.client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// Request body used when creating a new client.
@Getter
@Setter
public class CreateClientRequest {

    // Client name is required.
    @NotBlank(message = "Client name is required")
    private String name;

    // Email is optional, but if provided, it must be valid.
    @Email(message = "Client email must be valid")
    private String email;

    // Phone is optional.
    private String phone;

    // Company is optional.
    private String company;

    // Notes are optional.
    private String notes;
}

package com.mekonnen.backend.dto.client;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// Request body used when updating an existing client
@Getter
@Setter
public class UpdateClientRequest {

    // Client name is required during update too.
    @NotBlank(message = "Client name is required")
    private String name;

    // Email is optional, but if provided, must be valid.
    @Email(message = "Client email must be valid")
    private String email;

    // Phone is optional.
    private String phone;

    // Company is optional.
    private String company;

    // Notes are optional.
    private String notes;
}

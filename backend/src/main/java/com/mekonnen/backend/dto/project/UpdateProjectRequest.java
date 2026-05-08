package com.mekonnen.backend.dto.project;

import com.mekonnen.backend.entity.ProjectStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UpdateProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;


    private String description;


    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotNull(message = "Project status is required")
    private ProjectStatus status;


    private BigDecimal budget;

    // Dates are optional.
    private LocalDate startDate;
    private LocalDate dueDate;
}

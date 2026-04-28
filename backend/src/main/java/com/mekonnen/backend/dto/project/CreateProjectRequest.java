package com.mekonnen.backend.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateProjectRequest {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Long clientId;

    private BigDecimal budget;

    private LocalDate startDate;

    private LocalDate dueDate;
}

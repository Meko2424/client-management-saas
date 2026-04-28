package com.mekonnen.backend.dto.project;

import com.mekonnen.backend.entity.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectStatus status;
    private BigDecimal budget;
    private LocalDate startDate;
    private LocalDate dueDate;

    private Long clientId;
    private String clientName;
}

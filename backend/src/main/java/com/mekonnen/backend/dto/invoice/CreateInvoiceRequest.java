package com.mekonnen.backend.dto.invoice;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateInvoiceRequest {
    @NotNull
    private Long clientId;

    private Long projectId;

    @NotNull
    private BigDecimal amount;

    private LocalDate issueDate;
    private LocalDate dueDate;
}

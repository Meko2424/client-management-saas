package com.mekonnen.backend.dto.invoice;

import com.mekonnen.backend.entity.InvoiceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class UpdateInvoiceRequest {

    // Invoice must still belong to a valid client.
    @NotNull(message = "Client ID is required")
    private Long clientId;

    // Invoice may optionally be linked to a project.
    private Long projectId;

    // Invoice amount is required.
    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    // Invoice status is required.
    @NotNull(message = "Status is required")
    private InvoiceStatus status;

    // Dates are optional.
    private LocalDate issueDate;
    private LocalDate dueDate;

    // Notes are optional.
    private String notes;
}

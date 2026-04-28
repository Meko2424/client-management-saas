package com.mekonnen.backend.dto.invoice;

import com.mekonnen.backend.entity.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class InvoiceResponse {
    private Long id;
    private BigDecimal amount;
    private InvoiceStatus status;
    private LocalDate issueDate;
    private LocalDate dueDate;

    private String clientName;
    private String projectName;
}

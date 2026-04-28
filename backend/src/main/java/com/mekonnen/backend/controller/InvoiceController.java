package com.mekonnen.backend.controller;


import com.mekonnen.backend.dto.invoice.CreateInvoiceRequest;
import com.mekonnen.backend.dto.invoice.InvoiceResponse;
import com.mekonnen.backend.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    public InvoiceResponse create(
            @Valid @RequestBody CreateInvoiceRequest request,
            Authentication auth
    ) {
        return invoiceService.create(request, auth);
    }

    @GetMapping
    public List<InvoiceResponse> getAll(Authentication auth) {
        return invoiceService.getAll(auth);
    }
}

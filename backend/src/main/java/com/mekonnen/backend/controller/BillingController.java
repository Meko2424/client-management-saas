package com.mekonnen.backend.controller;

import com.mekonnen.backend.dto.billing.BillingStatusResponse;
import com.mekonnen.backend.service.BillingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(Authentication authentication) throws Exception {
        String checkoutUrl = billingService.createCheckoutSession(authentication);
        return Map.of("url", checkoutUrl);
    }

    @GetMapping("/status")
    public BillingStatusResponse getBillingStatus(Authentication authentication) {
        return billingService.getBillingStatus(authentication);
    }
}

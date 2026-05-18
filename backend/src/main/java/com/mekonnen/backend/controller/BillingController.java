package com.mekonnen.backend.controller;

import com.mekonnen.backend.config.AppProperties;
import com.mekonnen.backend.config.StripeProperties;
import com.mekonnen.backend.dto.billing.BillingStatusResponse;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.UserRepository;
import com.mekonnen.backend.service.BillingService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.billingportal.Session;
import com.stripe.param.billingportal.SessionCreateParams;
import org.springframework.http.ResponseEntity;
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
    private final AppProperties appProperties;
    private final UserRepository userRepository;
    private final StripeProperties stripeProperties;

    public BillingController(
            BillingService billingService,
            AppProperties appProperties,
            UserRepository userRepository,
            StripeProperties stripeProperties) {
        this.billingService = billingService;
        this.appProperties = appProperties;
        this.userRepository = userRepository;
        this.stripeProperties = stripeProperties;
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

    @PostMapping("/customer-portal")
    public ResponseEntity<?> createCustomerPortalSession(
            Authentication authentication
    ) throws StripeException {

        Stripe.apiKey = stripeProperties.getSecretKey();

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStripeCustomerId() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "No Stripe customer found"));
        }

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setCustomer(user.getStripeCustomerId())
                        .setReturnUrl(appProperties.getFrontendUrl() + "/upgrade")
                        .build();

        Session session = Session.create(params);

        return ResponseEntity.ok(
                Map.of("url", session.getUrl())
        );
    }
}

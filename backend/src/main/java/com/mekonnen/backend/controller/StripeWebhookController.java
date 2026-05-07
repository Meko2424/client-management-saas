package com.mekonnen.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mekonnen.backend.config.StripeProperties;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.repository.UserRepository;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.ResponseEntity.badRequest;

@RestController
@RequestMapping("/api/billing/webhook")
public class StripeWebhookController {

    private final StripeProperties stripeProperties;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public StripeWebhookController(
            StripeProperties stripeProperties,
            UserRepository userRepository
    ) {
        this.stripeProperties = stripeProperties;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signatureHeader
    ) {
        try {
            System.out.println("WEBHOOK CONTROLLER VERSION 2 ACTIVE");

            Event event = Webhook.constructEvent(
                    payload,
                    signatureHeader,
                    stripeProperties.getWebhookSecret()
            );

            System.out.println("Stripe event received: " + event.getType());

            JsonNode root = objectMapper.readTree(payload);
            JsonNode objectNode = root.path("data").path("object");

            String customerId = objectNode.path("customer").asText(null);
            String subscriptionId = objectNode.path("subscription").asText(null);
            String userId = objectNode.path("metadata").path("userId").asText(null);

            System.out.println("Payload customerId: " + customerId);
            System.out.println("Payload subscriptionId: " + subscriptionId);
            System.out.println("Payload userId metadata: " + userId);

            if ("checkout.session.completed".equals(event.getType()) && userId != null && !userId.isBlank()) {
                User user = userRepository.findById(Long.valueOf(userId))
                        .orElseThrow(() -> new RuntimeException("User not found for id: " + userId));

                activateUser(user, customerId, subscriptionId);
            }

            if (
                    "customer.subscription.created".equals(event.getType()) ||
                            "customer.subscription.updated".equals(event.getType()) ||
                            "invoice.payment_succeeded".equals(event.getType()) ||
                            "invoice.paid".equals(event.getType()) ||
                            "charge.succeeded".equals(event.getType())
            ) {
                if (customerId == null || customerId.isBlank()) {
                    throw new RuntimeException("Missing customerId for event: " + event.getType());
                }

                User user = userRepository.findByStripeCustomerId(customerId)
                        .orElseThrow(() -> new RuntimeException("User not found for Stripe customer: " + customerId));

                activateUser(user, customerId, subscriptionId);
            }

            return ResponseEntity.ok("success");

        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body("webhook error: " + ex.getMessage());
        }
    }

    private void activateUser(User user, String customerId, String subscriptionId) {
        System.out.println("Activating user: " + user.getEmail());

        user.setSubscriptionPlan("PRO");
        user.setSubscriptionStatus("ACTIVE");

        if (customerId != null && !customerId.isBlank()) {
            user.setStripeCustomerId(customerId);
        }

        if (subscriptionId != null && !subscriptionId.isBlank()) {
            user.setStripeSubscriptionId(subscriptionId);
        }

        userRepository.saveAndFlush(user);

        System.out.println("User upgraded to PRO and ACTIVE");
    }
}

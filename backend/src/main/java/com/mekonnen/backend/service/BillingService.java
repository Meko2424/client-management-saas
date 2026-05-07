package com.mekonnen.backend.service;

import com.mekonnen.backend.config.AppProperties;
import com.mekonnen.backend.config.StripeProperties;
import com.mekonnen.backend.dto.billing.BillingStatusResponse;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class BillingService {
    private final UserRepository userRepository;
    private final StripeProperties stripeProperties;
    private final AppProperties appProperties;

    public BillingService(
            UserRepository userRepository,
            StripeProperties stripeProperties,
            AppProperties appProperties
    ) {
        this.userRepository = userRepository;
        this.stripeProperties = stripeProperties;
        this.appProperties = appProperties;
    }

    public String createCheckoutSession(Authentication authentication) throws Exception {
        User user = getCurrentUser(authentication);

        Stripe.apiKey = stripeProperties.getSecretKey();

        if (user.getStripeCustomerId() == null || user.getStripeCustomerId().isBlank()) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(user.getEmail())
                    .setName(user.getFullName())
                    .build();

            Customer customer = Customer.create(customerParams);

            user.setStripeCustomerId(customer.getId());
            userRepository.save(user);
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(user.getStripeCustomerId())
                .setSuccessUrl(appProperties.getFrontendUrl() + "/billing/success")
                .setCancelUrl(appProperties.getFrontendUrl() + "/billing/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(stripeProperties.getProPriceId())
                                .setQuantity(1L)
                                .build()
                )
                .putMetadata("userId", user.getId().toString())
                .build();

        Session session = Session.create(params);

        return session.getUrl();
    }

    public BillingStatusResponse getBillingStatus(Authentication authentication) {
        User user = getCurrentUser(authentication);

        return new BillingStatusResponse(
                user.getSubscriptionPlan(),
                user.getSubscriptionStatus()
        );
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

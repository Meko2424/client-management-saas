package com.mekonnen.backend.dto.billing;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BillingStatusResponse {
    private String subscriptionPlan;
    private String subscriptionStatus;
}

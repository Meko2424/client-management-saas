import { apiFetch } from "./api";

export function createCheckoutSession() {
  return apiFetch("/api/billing/create-checkout-session", {
    method: "POST",
  });
}

export function getBillingStatus() {
  return apiFetch("/api/billing/status");
}

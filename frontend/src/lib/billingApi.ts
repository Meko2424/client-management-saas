import { apiFetch } from "./api";

export function createCheckoutSession() {
  return apiFetch("/api/billing/create-checkout-session", {
    method: "POST",
  });
}

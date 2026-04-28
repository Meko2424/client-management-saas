import { apiFetch } from "./api";

// Fetch dashboard summary metrics from backend.
export function getDashboardSummary() {
  return apiFetch("/api/dashboard/summary");
}

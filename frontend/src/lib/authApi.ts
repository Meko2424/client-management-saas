import { apiFetch } from "./api";

export function loginApi(data: any) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function registerApi(data: any) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function forgotPasswordApi(data: { email: string }) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resetPasswordApi(data: { token: string; newPassword: string }) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

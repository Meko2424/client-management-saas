import { apiFetch } from "./api";

// Get all clients
export function getClients() {
  return apiFetch("/api/clients");
}

// Create new client
export function createClient(data: any) {
  return apiFetch("/api/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Delete client
export function deleteClient(id: number) {
  return apiFetch(`/api/clients/${id}`, {
    method: "DELETE",
  });
}

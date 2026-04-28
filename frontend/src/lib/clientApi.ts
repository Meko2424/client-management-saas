import { apiFetch } from "./api";

export type ClientPayload = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
};

export function getClients() {
  return apiFetch("/api/clients");
}

export function getClientById(id: number) {
  return apiFetch(`/api/clients/${id}`);
}

export function createClient(data: ClientPayload) {
  return apiFetch("/api/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateClient(id: number, data: ClientPayload) {
  return apiFetch(`/api/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteClient(id: number) {
  return apiFetch(`/api/clients/${id}`, {
    method: "DELETE",
  });
}

export function getProjects() {
  return apiFetch("/api/projects");
}

export function createProject(data: any) {
  return apiFetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

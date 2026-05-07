// Base URL for backend API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

// Helper to get token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Generic fetch wrapper
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    if (res.status === 403) {
      throw new Error(error.message || "Upgrade required");
    }

    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}

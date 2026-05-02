import { render, waitFor } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockClear();
  });

  it("redirects to login when token is missing", async () => {
    render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  it("renders children when token exists", async () => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        token: "fake-token",
        userId: 1,
        fullName: "Test User",
        email: "test@example.com",
        role: "USER",
      }),
    );

    const { getByText } = render(
      <AuthProvider>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(getByText("Protected Content")).toBeInTheDocument();
    });
  });
});

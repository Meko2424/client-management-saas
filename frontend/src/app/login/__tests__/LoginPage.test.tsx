import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";
import { AuthProvider } from "@/context/AuthContext";

// Mock router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock API call
jest.mock("@/lib/authApi", () => ({
  loginApi: jest.fn(),
}));

import { loginApi } from "@/lib/authApi";

describe("LoginPage", () => {
  it("submits login form successfully", async () => {
    const user = userEvent.setup();

    (loginApi as jest.Mock).mockResolvedValue({
      token: "fake-token",
      userId: 1,
      fullName: "Test User",
      email: "test@example.com",
      role: "USER",
    });

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    await user.type(screen.getByPlaceholderText("Email"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(loginApi).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("shows error when login fails", async () => {
    const user = userEvent.setup();

    (loginApi as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    render(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>,
    );

    await user.type(screen.getByPlaceholderText("Email"), "wrong@example.com");
    await user.type(screen.getByPlaceholderText("Password"), "wrongpass");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(loginApi).toHaveBeenCalledWith({
      email: "wrong@example.com",
      password: "wrongpass",
    });
  });
});

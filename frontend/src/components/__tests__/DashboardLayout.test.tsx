import { render } from "@testing-library/react";
import DashboardLayout from "../DashboardLayout";
import { AuthProvider } from "@/context/AuthContext";

// Mock Next.js router because Jest does not mount the real App Router.
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("DashboardLayout", () => {
  it("renders sidebar title", () => {
    const { getByText } = render(
      <AuthProvider>
        <DashboardLayout>
          <div>Test Content</div>
        </DashboardLayout>
      </AuthProvider>,
    );

    expect(getByText("Mini CRM")).toBeInTheDocument();
    expect(getByText("Test Content")).toBeInTheDocument();
  });
});

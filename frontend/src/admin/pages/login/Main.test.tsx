import { fireEvent, screen, waitFor } from "@testing-library/react";
import AdminLoginPage from "./Main";
import { renderWithRouter } from "../../../test-utils/renderWithRouter";

const mockAdminLogin = jest.fn();

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useMutation: () => [mockAdminLogin, { loading: false }],
  };
});

jest.mock("../../../helpers/verifyRole", () => ({
  verifyRole: jest.fn().mockResolvedValue(false),
}));

describe("AdminLoginPage", () => {
  beforeEach(() => {
    mockAdminLogin.mockReset();
    window.localStorage.clear();
  });

  it("shows missing required fields when role/password are empty", async () => {
    renderWithRouter(<AdminLoginPage />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    expect(
      await screen.findByText(/missing required fields/i)
    ).toBeInTheDocument();
    expect(mockAdminLogin).not.toHaveBeenCalled();
  });
});

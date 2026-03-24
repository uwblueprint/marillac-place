import { fireEvent, screen, waitFor } from "@testing-library/react";
import ParticipantsLoginPage from "./Main";
import { renderWithRouter } from "../../../test-utils/renderWithRouter";

const mockParticipantLogin = jest.fn();

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useMutation: () => [mockParticipantLogin, { loading: false }],
  };
});

jest.mock("../../../helpers/verifyRole", () => ({
  verifyRole: jest.fn().mockResolvedValue(false),
}));

describe("ParticipantsLoginPage", () => {
  beforeEach(() => {
    mockParticipantLogin.mockReset();
    window.localStorage.clear();
  });

  it("shows missing required fields when id/password are empty", async () => {
    renderWithRouter(<ParticipantsLoginPage />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText(/missing required fields/i)
    ).toBeInTheDocument();
    expect(mockParticipantLogin).not.toHaveBeenCalled();
  });
});

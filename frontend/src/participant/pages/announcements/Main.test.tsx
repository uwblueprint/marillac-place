import { screen } from "@testing-library/react";
import * as ApolloClient from "@apollo/client";
import ParticipantsAnnouncementsPage from "./Main";
import { ParticipantContext } from "../../ParticipantContext";
import { renderWithRouter } from "../../../test-utils/renderWithRouter";

describe("ParticipantsAnnouncementsPage empty/undefined state", () => {
  beforeEach(() => {
    jest.spyOn(ApolloClient, "useQuery").mockReturnValue({
      loading: false,
      error: undefined,
      data: undefined,
      refetch: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders filter controls when announcements data is undefined", () => {
    renderWithRouter(
      <ParticipantContext.Provider
        value={{
          pid: 1,
          room: 1,
          balance: 0,
          totalEarnings: 0,
          setPid: jest.fn(),
          setRoom: jest.fn(),
          setBalance: jest.fn(),
          setTotalEarnings: jest.fn(),
        }}
      >
        <ParticipantsAnnouncementsPage />
      </ParticipantContext.Provider>,
      "/announcements"
    );

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unread" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pinned" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Important" })).toBeInTheDocument();
  });
});

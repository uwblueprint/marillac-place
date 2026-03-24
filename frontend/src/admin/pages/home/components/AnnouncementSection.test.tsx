import { screen } from "@testing-library/react";
import * as ApolloClient from "@apollo/client";
import AnnouncementSection from "./AnnouncementSection";
import { renderWithRouter } from "../../../../test-utils/renderWithRouter";

describe("AnnouncementSection empty state", () => {
  beforeEach(() => {
    jest.spyOn(ApolloClient, "useQuery").mockReturnValue({
      loading: false,
      error: undefined,
      data: { getAnnouncementsFromToday: [] },
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders empty message when there are no announcements", () => {
    renderWithRouter(<AnnouncementSection />, "/admin");

    expect(screen.getByText("Announcements")).toBeInTheDocument();
    expect(screen.getByText("No Announcements Yet")).toBeInTheDocument();
  });
});

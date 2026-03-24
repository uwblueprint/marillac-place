import { screen } from "@testing-library/react";
import * as ApolloClient from "@apollo/client";
import NoteSection from "./NoteSection";
import { renderWithRouter } from "../../../../test-utils/renderWithRouter";

describe("NoteSection empty state", () => {
  beforeEach(() => {
    jest.spyOn(ApolloClient, "useMutation").mockReturnValue([
      jest.fn(),
      { loading: false, error: undefined },
    ] as any);
    jest.spyOn(ApolloClient, "useQuery").mockReturnValue({
      loading: false,
      error: undefined,
      data: { getNotes: [] },
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders empty message when there are no internal notes", () => {
    renderWithRouter(<NoteSection />, "/admin");

    expect(screen.getByText("Internal Notes")).toBeInTheDocument();
    expect(screen.getByText("No Admin Notes Yet")).toBeInTheDocument();
  });
});

import { screen } from "@testing-library/react";
import * as ApolloClient from "@apollo/client";
import ReportsTable from "./ReportsTable";
import { renderWithRouter } from "../../../../test-utils/renderWithRouter";

jest.mock("../../../../hooks/useNotification", () => ({
  __esModule: true,
  default: () => ({ sendNotification: jest.fn() }),
}));

describe("ReportsTable", () => {
  beforeEach(() => {
    jest.spyOn(ApolloClient, "useMutation").mockReturnValue([
      jest.fn(),
      { loading: false },
    ] as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders headers in empty state without crashing", () => {
    renderWithRouter(<ReportsTable reports={[]} refetch={jest.fn()} />, "/admin/reports");

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
  });
});

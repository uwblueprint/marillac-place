import { screen } from "@testing-library/react";
import PastParticipantTable from "./PastParticipantTable";
import { renderWithRouter } from "../../../../test-utils/renderWithRouter";

describe("PastParticipantTable", () => {
  it("renders table headers when participant list is empty", () => {
    renderWithRouter(
      <PastParticipantTable
        participants={[]}
        refetch={jest.fn()}
        loading={false}
        error={undefined}
      />
    );

    expect(screen.getByText("ID Number")).toBeInTheDocument();
    expect(screen.getByText("Arrival Date")).toBeInTheDocument();
    expect(screen.getByText("Departure Date")).toBeInTheDocument();
  });
});

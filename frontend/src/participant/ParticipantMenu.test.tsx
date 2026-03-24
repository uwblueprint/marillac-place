import { fireEvent, screen } from "@testing-library/react";
import ParticipantMenu from "./ParticipantMenu";
import { renderWithRouter } from "../test-utils/renderWithRouter";

describe("ParticipantMenu", () => {
  it("opens and closes hamburger menu interaction", () => {
    renderWithRouter(<ParticipantMenu room={1} balance={25} />, "/");

    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Open menu"));
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close menu"));
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
  });
});

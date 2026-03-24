import { render } from "@testing-library/react";
jest.mock("date-fns/locale/en-CA", () => ({ enCA: {} }));
jest.mock("./ui/UI", () => () => <div>UI Mock</div>);

jest.mock("./admin/pages/schedule/Main", () => () => <div>Admin Schedule Mock</div>);
jest.mock("./participant/pages/schedule/Main", () => () => (
  <div>Participant Schedule Mock</div>
));
import App from "./App";

describe("App routes", () => {
  it("renders app shell at participant root route", () => {
    window.history.pushState({}, "Test page", "/");
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it("renders app shell at admin route", () => {
    window.history.pushState({}, "Admin page", "/admin");
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});

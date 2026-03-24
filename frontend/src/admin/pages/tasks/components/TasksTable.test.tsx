import { screen } from "@testing-library/react";
import * as ApolloClient from "@apollo/client";
import TasksTable from "./TasksTable";
import { TaskType } from "../../../../types/enums";
import { renderWithRouter } from "../../../../test-utils/renderWithRouter";

jest.mock("../../../../hooks/useNotification", () => ({
  __esModule: true,
  default: () => ({ sendNotification: jest.fn() }),
}));

describe("TasksTable", () => {
  beforeEach(() => {
    jest.spyOn(ApolloClient, "useMutation").mockReturnValue([
      jest.fn(),
      { loading: false },
    ] as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("includes the Individual Goal row for OPTIONAL tasks when task list is empty", () => {
    renderWithRouter(
      <TasksTable
        taskType={TaskType.OPTIONAL}
        loading={false}
        error={undefined}
        tasks={[]}
        refetch={jest.fn()}
      />
    );

    expect(screen.getByText("Individual Goal")).toBeInTheDocument();
    expect(screen.getAllByText("Participant Preference").length).toBeGreaterThan(0);
  });
});

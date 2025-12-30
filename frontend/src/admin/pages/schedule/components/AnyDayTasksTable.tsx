import React from "react";
import { Flex } from "@chakra-ui/react";
import {
  isSameDay,
  differenceInCalendarDays,
  isEqual,
  startOfDay,
} from "date-fns";
import { AssignedTask } from "../../../../types/models";
import DataTable, { Column, Row } from "../../../../ui/misc/DataTable";
import TaskStatusDisplay from "../../../../ui/misc/TaskStatusDisplay";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import { Marker } from "../../../../ui/icons/ActionIcons";
import { DAY_ABBREVIATIONS, DAYS } from "../../../../constants/days";

interface AnyDayTasksTableProps {
  tasks: AssignedTask[];
  onTaskSelect: (event: AssignedTask) => void;
  error?: string;
  loading: boolean;
}

export default function AnyDayTasksTable({
  tasks,
  onTaskSelect,
  error,
  loading,
}: AnyDayTasksTableProps) {
  const columns: Column[] = [
    { header: "Name", width: "22%" },
    { header: "Status", width: "24%" },
    { header: "Days", width: "22%" },
    { header: "Marillac Bucks", width: "20%" },
    { header: "", width: "12%", center: true },
  ];

  function isAnyDayTask(task: AssignedTask): boolean {
    return (
      !isSameDay(task.start_date, task.end_date) &&
      !(
        differenceInCalendarDays(task.end_date, task.start_date) === 1 &&
        isEqual(task.end_date, startOfDay(task.end_date))
      )
    );
  }

  const rows: Row[][] = tasks
    .filter((task: AssignedTask) => isAnyDayTask(task))
    .map((task: AssignedTask) => [
      {
        element: task.name,
      },
      {
        element: (
          <Flex pr="35px">
            <TaskStatusDisplay status={task.status} />
          </Flex>
        ),
        action: () => {},
      },
      {
        element: [task.start_date, task.end_date]
          .map((day: string) => DAY_ABBREVIATIONS[DAYS[new Date(day).getDay()]])
          .join(" - "),
      },
      {
        element: formatCurrency(task.value),
      },
      {
        element: <Marker size={20} />,
        action: () => onTaskSelect(task),
      },
    ]);

  return (
    <DataTable loading={loading} error={error} columns={columns} rows={rows} />
  );
}

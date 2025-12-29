import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { isSameDay, startOfWeek, addDays, differenceInCalendarDays, isEqual, startOfDay } from "date-fns";
import { AssignedTask } from "../../../../types/models";
import DataTable, { Column, Row } from "../../../../ui/misc/DataTable";
import { DayOfWeek } from "../../../../types/enums";
import { formatTimeString, now } from "../../../../helpers/formatDateTime";
import { DAYS } from "../../../../constants/days";
import TaskStatusDisplay from "../../../../ui/misc/TaskStatusDisplay";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import { Marker } from "../../../../ui/icons/ActionIcons";
import { toTitleCase } from "../../../../helpers/stringUtils";

interface DailyTasksTableProps {
  tasks: AssignedTask[];
  onTaskSelect: (event: AssignedTask) => void;
  error?: string;
  loading: boolean;
}
export default function DailyTasksTable({
  tasks,
  onTaskSelect,
  error,
  loading,
}: DailyTasksTableProps) {
  const [chosenDay, setChosenDay] = useState<DayOfWeek>(DAYS[now().getDay()]);

  const columns: Column[] = [
    { header: "Name", width: "22%" },
    { header: "Status", width: "24%" },
    { header: "Time", width: "22%" },
    { header: "Marillac Bucks", width: "20%" },
    { header: "", width: "12%", center: true },
  ];

  const [rows, setRows] = useState<Row[][]>([]);

  function isDailyAnytimeTask(task: AssignedTask): boolean {
    return (
      differenceInCalendarDays(task.end_date, task.start_date) === 1 &&
      isEqual(task.end_date, startOfDay(task.end_date))
    )
  }

  function isDailyTask(task: AssignedTask, day: DayOfWeek): boolean {
    const chosenDate = addDays(
      startOfWeek(now()),
      DAYS.indexOf(day)
    );
    return (
      isSameDay(task.start_date, chosenDate) &&
      (isSameDay(task.start_date, task.end_date) ||
      isDailyAnytimeTask(task))
    );
  }

  useEffect(() => {
    setRows(
      tasks
        .filter((task: AssignedTask) => isDailyTask(task, chosenDay))
        .map((task: AssignedTask) => [
          {
            element: task.name,
          },
          {
            element: <Flex pr="35px"><TaskStatusDisplay status={task.status} /></Flex>,
            action: () => {},
          },
          {
            element: isDailyAnytimeTask(task) 
              ? "Anytime" 
              : `${formatTimeString(task.start_date)} - ${formatTimeString(task.end_date)}`,
          },
          {
            element: formatCurrency(task.value),
          },
          {
            element: <Marker size={20} />,
            action: () => onTaskSelect(task),
          },
        ])
    );
  }, [chosenDay, tasks]);

  return (
    <Flex flexDir="column" w="100%">
      <Flex w="100%" alignItems="center" justifyContent="center">
        {DAYS.map((day: DayOfWeek) => (
          <Button
            key={day}
            onClick={() => setChosenDay(day)}
            isActive={chosenDay === day}
            cursor="pointer"
            borderTopRadius="8px"
            borderBottomRadius="0px"
            border="1px solid"
            borderBottom="none"
            borderColor="#C5C8D8"
            width="14.1%"
            height="fit-content"
            paddingX="12px"
            paddingY="6px"
            bg="#FFFFFF"
            _hover={{
              bg: "#F5F6F8",
            }}
            _active={{
              bg: "#F5F6F8",
            }}
          >
            <Text textStyle="web.s1" color="text.light.primary">
              {toTitleCase(day)}
            </Text>
          </Button>
        ))}
      </Flex>
      <DataTable
        loading={loading}
        error={error}
        columns={columns}
        rows={rows}
      />
    </Flex>
  );
}

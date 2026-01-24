import React, { useEffect, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { isSameDay, startOfWeek, addDays } from "date-fns";
import { AssignedTask } from "../../../../types/models";
import DataTable, { Column, Row } from "../../../../ui/misc/DataTable";
import { DayOfWeek } from "../../../../types/enums";
import { formatDateV2 } from "../../../../helpers/formatDateTime";
import { DAYS } from "../../../../constants/days";
import TaskStatusDisplay from "../../../../ui/misc/TaskStatusDisplay";
import { formatCurrency } from "../../../../helpers/formatCurrency";
import { Marker } from "../../../../ui/icons/ActionIcons";
import { toTitleCase } from "../../../../helpers/stringUtils";
import { isAllDayTask } from "../../../../helpers/taskHelpers";

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
  const [chosenDay, setChosenDay] = useState<DayOfWeek>(
    DAYS[new Date().getDay()]
  );

  const columns: Column[] = [
    { header: "Name", width: "22%" },
    { header: "Status", width: "24%" },
    { header: "Time", width: "22%" },
    { header: "Marillac Bucks", width: "20%" },
    { header: "", width: "12%", center: true },
  ];

  const [rows, setRows] = useState<Row[][]>([]);

  function isDailyTask(task: AssignedTask, day: DayOfWeek): boolean {
    const chosenDate = addDays(startOfWeek(new Date()), DAYS.indexOf(day));
    return (
      isSameDay(new Date(task.start_date), chosenDate) &&
      isSameDay(new Date(task.end_date), chosenDate)
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
            element: (
              <Flex pr="35px">
                <TaskStatusDisplay status={task.status} />
              </Flex>
            ),
            action: () => {},
          },
          {
            element: isAllDayTask(task)
              ? "Anytime"
              : `${formatDateV2(new Date(task.start_date))} - ${formatDateV2(
                  new Date(task.end_date)
                )}`,
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
            paddingTop="8px"
            paddingBottom="6px"
            bg="white"
            _hover={{
              bg: "background.highlight",
            }}
            _active={{
              bg: "background.highlight",
            }}
          >
            <Text textStyle="s2" color="text.dark">
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

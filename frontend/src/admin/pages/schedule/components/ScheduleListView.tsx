import React, { useState } from "react";
import { VStack, Box, Text, HStack, Button } from "@chakra-ui/react";
import { CalendarEvent } from "./ScheduleTypes";
import TaskTableTop from "./TaskTableTop";
import TaskTableBottom from "./TaskTableBottom";
import { DayOfWeek } from "../../../../types/task";
import { isSameDay } from "../../../../utils/formatDate";
import { weekdays } from "../../../../constants/rooms";
import { toTitleCase } from "../../../../utils/stringHelpers";

interface ScheduleListViewProps {
  specificTasks: CalendarEvent[];
  anytimeTasks: CalendarEvent[];
  anydayTasks: CalendarEvent[];
  onTaskSelect: (event: CalendarEvent) => void;
}

export default function ScheduleListView({
  specificTasks,
  anytimeTasks,
  anydayTasks,
  onTaskSelect,
}: ScheduleListViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(DayOfWeek.MONDAY);

  const getTasksForDay = (dayName: DayOfWeek): CalendarEvent[] => {
    const specficTasksForDay = specificTasks.filter((task) => {
      return isSameDay(dayName, task.start);
    });
    const anytimeTasksForDay = anytimeTasks.filter((task) => {
      return isSameDay(dayName, task.start);
    });
    return [...specficTasksForDay, ...anytimeTasksForDay];
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Box position="relative" width="100%">
        <Text textStyle="web.h3" color="primary.700" mb={2}>
          Daily
        </Text>
        <HStack
          spacing={0}
          width="100%"
          position="relative"
          zIndex={1}
          borderBottom="1px solid"
          borderColor="gray.200"
          pb={7}
        >
          {weekdays.map((day, index) => (
            <Button
              key={index}
              variant={
                selectedDay === (day as DayOfWeek) ? "primaryFilled" : "white"
              }
              borderBottomRadius={0}
              flex={1}
              py={2}
              onClick={() => setSelectedDay(day as DayOfWeek)}
            >
              <Text color="inherit" textStyle="web.s1">
                {toTitleCase(day)}
              </Text>
            </Button>
          ))}
        </HStack>

        <Box
          position="relative"
          zIndex={2}
          mt="-32px"
          bg="white"
          boxShadow="sm"
          borderRadius="md"
        >
          <TaskTableTop
            tasks={getTasksForDay(selectedDay)}
            onTaskSelect={onTaskSelect}
          />
        </Box>
      </Box>

      <Box>
        <Text textStyle="web.h3" color="primary.700" mb={2}>
          Any Day
        </Text>

        <TaskTableBottom tasks={anydayTasks} onTaskSelect={onTaskSelect} />
      </Box>
    </VStack>
  );
}

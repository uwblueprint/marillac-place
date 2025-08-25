import React from "react";
import { VStack, Box, Text, HStack, Button } from "@chakra-ui/react";
import moment from "moment";
import { CalendarEvent, ParticipantData } from "../../types/ScheduleTypes";
import { getDaysOfWeek } from "../../utils/scheduleUtils";
import TaskTableTop from "./TaskTableTop";
import TaskTableBottom from "./TaskTableBottom";

interface ScheduleListViewProps {
  participantData: ParticipantData;
  currentDate: Date;
  selectedDay: string;
  onDayChange: (day: string) => void;
  onTaskSelect: (event: CalendarEvent) => void;
}

export default function ScheduleListView({
  participantData,
  currentDate,
  selectedDay,
  onDayChange,
  onTaskSelect,
}: ScheduleListViewProps) {
  const daysOfWeek = getDaysOfWeek(currentDate);

  // Get tasks for the selected day
  const getTasksForDay = (dayName: string): CalendarEvent[] => {
    if (!participantData?.assigned_tasks) return [];

    // Filter tasks that are NOT "anyday" tasks (those go in the separate section)
    const dailyTasks = participantData.assigned_tasks.filter(
      (event) =>
        !event.allDay &&
        !event.title.toLowerCase().includes("anyday") &&
        !event.title.toLowerCase().includes("laundry")
    );

    // Get the specific date for the selected day in the current week
    const currentWeekStart = moment(currentDate).startOf("week");
    const dayIndex = daysOfWeek.findIndex((day) => day.name === dayName);

    if (dayIndex === -1) return [];

    const targetDate = currentWeekStart.clone().add(dayIndex, "days");

    // Filter tasks that are scheduled on the selected day
    const tasksForDay = dailyTasks.filter((event) => {
      // Check if the event starts on the selected day
      const eventStartDate = moment(event.start);

      if (eventStartDate.isValid()) {
        return eventStartDate.isSame(targetDate, "day");
      }

      // If date parsing fails, assume it's a daily task that can appear on any day
      return true;
    });

    return tasksForDay;
  };

  // Get anyday tasks (all-day events)
  const getAnydayTasks = (): CalendarEvent[] => {
    if (!participantData?.assigned_tasks) return [];

    // Filter tasks that are all-day events (anyday tasks)
    return participantData.assigned_tasks.filter(
      (event) =>
        event.allDay ||
        event.title.toLowerCase().includes("anyday") ||
        event.title.toLowerCase().includes("laundry")
    );
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
          {daysOfWeek.map((day) => (
            <Button
              key={day.name}
              variant={ selectedDay === day.name ? "primaryFilled" : "white" }
              borderBottomRadius={0}
              flex={1}
              py={2}
              onClick={() => onDayChange(day.name)}
            >
              <Text color="inherit" textStyle="web.s1">
                {day.name}
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

      {/* Any Day Section */}
      <Box>
        <Text textStyle="web.h3" color="primary.700" mb={2}>
          Any Day
        </Text>

        <TaskTableBottom tasks={getAnydayTasks()} onTaskSelect={onTaskSelect} />
      </Box>
    </VStack>
  );
}

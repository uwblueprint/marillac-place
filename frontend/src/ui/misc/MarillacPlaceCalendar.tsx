import React from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import {
  Calendar,
  dateFnsLocalizer,
  NavigateAction,
  View,
  Views,
} from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
  addWeeks,
  subWeeks,
  setMinutes,
  setHours,
  startOfDay,
  differenceInMinutes,
} from "date-fns";
import { enCA } from "date-fns/locale/en-CA";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AssignedTask } from "../../types/models";
import { formatTimeString, now } from "../../helpers/formatDateTime";
import { DisplayView } from "../../constants/views";

type CustomHeaderProps = {
  date: Date;
};

function CustomHeader({ date }: CustomHeaderProps) {
  const dayAbbr = format(date, "EEE").toUpperCase();
  const dayNumber = format(date, "d");
  const isToday = isSameDay(date, now());

  return (
    <Box
      textAlign="center"
      py={2}
      px={2}
      minH="80px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Text textStyle="web.b2" mb={1} letterSpacing="0.3px">
        {dayAbbr}
      </Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="27px"
        h="27px"
        borderRadius="full"
        bg={isToday ? "secondary.700" : "transparent"}
        cursor="default"
        margin="0"
        padding="0"
      >
        <Text
          textStyle="web.b1"
          textAlign="center"
          color={isToday ? "white" : "black"}
        >
          {dayNumber}
        </Text>
      </Box>
    </Box>
  );
}

type AssignedTaskEventProps = {
  assignedTask: AssignedTask;
  viewTaskDetails: (task: AssignedTask | null) => void;
};

function AssignedTaskEvent({
  assignedTask,
  viewTaskDetails,
}: AssignedTaskEventProps) {
  const displayDate = isSameDay(
    new Date(assignedTask.start_date),
    new Date(assignedTask.end_date)
  );
  return (
    <Flex
      padding="4px"
      cursor="pointer"
      onClick={() => viewTaskDetails(assignedTask)}
      direction="column"
      gap="2px"
    >
      <Text textStyle="web.s1" color="inherit">
        {assignedTask.name}
      </Text>
      {displayDate && (
        <Text fontSize="10px" color="inherit">
          {formatTimeString(assignedTask.start_date)} -{" "}
          {formatTimeString(assignedTask.end_date)}
        </Text>
      )}
    </Flex>
  );
}

type MarillacPlaceCalendarProps = {
  assignedTasks: AssignedTask[];
  startDate: Date;
  setStartDate: (date: Date) => void;
  viewTaskDetails: (task: AssignedTask | null) => void;
  view: DisplayView;
};

export default function MarillacPlaceCalendar({
  assignedTasks,
  startDate,
  setStartDate,
  viewTaskDetails,
  view,
}: MarillacPlaceCalendarProps) {
  const calendarView = view === DisplayView.MOBILE ? Views.DAY : Views.WEEK;
  return (
    <>
      {view === DisplayView.MOBILE && (
        <Text textStyle="web.b1" mb="12px" textAlign="center">
          {format(startDate, "EEEE d").toUpperCase()}
        </Text>
      )}
      <Box w="100%"minH="fit-content" overflow="hidden">
        <Calendar
          localizer={dateFnsLocalizer({
            format,
            parse,
            startOfWeek: () => startOfWeek(now(), { weekStartsOn: 0 }),
            startOfDay: () => startOfDay(now()),
            getDay,
            locales: { "en-CA": enCA },
          })}
          events={assignedTasks}
          titleAccessor="name"
          startAccessor={(event: AssignedTask) => new Date(event.start_date)}
          endAccessor={(event: AssignedTask) => new Date(event.end_date)}
          view={calendarView}
          date={startDate}
          min={setMinutes(setHours(now(), 6), 0)}
          onSelectEvent={viewTaskDetails}
          formats={{ eventTimeRangeFormat: () => "" }}
          toolbar={false}
          components={{
            event: (props: { event: AssignedTask }) => {
              const { event } = props;
              return (
                <AssignedTaskEvent
                  assignedTask={event}
                  viewTaskDetails={viewTaskDetails}
                />
              );
            },
            week: { header: CustomHeader },
          }}
          eventPropGetter={(event: AssignedTask) => {
            const statusClass = `status-${event.status.toLowerCase()}`;
            return {
              className: statusClass,
            };
          }}
        />
      </Box>
    </>
  );
}

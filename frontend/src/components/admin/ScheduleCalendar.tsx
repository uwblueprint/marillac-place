import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent, TaskStatus } from "../../types/ScheduleTypes";
import {
  getTaskStatusColor,
  getTaskStatusBgColor,
  getDayNameMapping,
  formatEventTime,
} from "../../utils/scheduleUtils";
import { CommentIcon } from "./CustomIcons";
import colors from "../../theme/colors";

const localizer = momentLocalizer(moment);

interface ScheduleCalendarProps {
  events: CalendarEvent[];
  allDayEvents: CalendarEvent[];
  currentDate: Date;
  onNavigate: (date: Date) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  scrollToTime?: Date;
}

// Custom header component for calendar
const CustomHeader: React.FC<{ date: Date }> = ({ date }) => {
  const dayNames = getDayNameMapping();

  const dayAbbr = moment(date).format("ddd").toUpperCase();
  const dayName = dayNames[dayAbbr] || dayAbbr;
  const dayNumber = moment(date).format("D");
  const isToday = moment(date).isSame(moment(), "day");

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
      <Text textStyle="mobile.h2" color="black" mb={2} letterSpacing="0.5px">
        {dayName}
      </Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="27px"
        h="27px"
        borderRadius="full"
        bg={isToday ? "orange.500" : "transparent"}
        cursor="default"
        margin="0"
        padding="0"
      >
        <Text
          fontWeight="400"
          fontSize="20px"
          fontFamily="Nunito"
          lineHeight="1"
          margin="0"
          padding="0"
          textAlign="center"
          color={isToday ? "white" : "gray.800"}
        >
          {dayNumber}
        </Text>
      </Box>
    </Box>
  );
};

// Custom event component for calendar
const EventComponent: React.FC<{
  event: CalendarEvent;
  onSelectEvent?: (event: CalendarEvent) => void;
}> = ({ event, onSelectEvent }) => {
  // For all-day events, use simpler styling
  if (event.allDay) {
    return (
      <Text color="inherit" fontWeight="600" fontSize="xs">
        {event.title}
      </Text>
    );
  }

  // For timed events, show name on top and time underneath
  return (
    <div
      style={{
        padding: "4px",
        fontSize: "12px",
        cursor: "pointer",
      }}
      onClick={() => onSelectEvent?.(event)}
    >
      <div style={{ fontWeight: "600", marginBottom: "2px" }}>
        {event.title}
      </div>
      <div style={{ fontSize: "10px", opacity: "0.8" }}>
        {formatEventTime(event.start, event.end)}
      </div>
      {event.comment && (
        <div style={{ marginTop: "2px" }}>
          <CommentIcon size={12} color="currentColor" />
        </div>
      )}
    </div>
  );
};

export default function ScheduleCalendar({
  events,
  allDayEvents,
  currentDate,
  onNavigate,
  onSelectEvent,
  scrollToTime = moment().hour(7).minute(0).toDate(),
}: ScheduleCalendarProps) {
  // Combine regular events with all-day events
  const allEvents = [...events, ...allDayEvents];

  // Set CSS custom properties from theme colors
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--status-complete",
      getTaskStatusColor(TaskStatus.COMPLETE)
    );
    root.style.setProperty(
      "--status-assigned",
      getTaskStatusColor(TaskStatus.ASSIGNED)
    );
    root.style.setProperty(
      "--status-incomplete",
      getTaskStatusColor(TaskStatus.INCOMPLETE)
    );
    root.style.setProperty(
      "--status-excused",
      getTaskStatusColor(TaskStatus.EXCUSED)
    );

    root.style.setProperty("--status-complete-bg", colors.actionsLight.green);
    root.style.setProperty("--status-assigned-bg", colors.actionsLight.blue);
    root.style.setProperty("--status-incomplete-bg", colors.actionsLight.red);
    root.style.setProperty("--status-excused-bg", colors.actionsLight.yellow);

    root.style.setProperty("--status-complete-text", colors.actionsDark.green);
    root.style.setProperty("--status-assigned-text", colors.actionsDark.blue);
    root.style.setProperty("--status-incomplete-text", colors.actionsDark.red);
    root.style.setProperty("--status-excused-text", colors.actionsDark.yellow);
  }, []);

  return (
    <Box
      w="100%"
      h="100%"
      minH={0}
      display="flex"
      flexDirection="column"
      id="react-big-calendar-container"
      overflow="hidden"
      sx={{
        // Override calendar styles
        ".rbc-time-gutter .rbc-label": {
          fontFamily: "Nunito !important",
          fontWeight: "400 !important",
          color: "black !important",
        },
        ".rbc-time-gutter.rbc-time-column": {
          backgroundColor: "transparent !important",
        },
        ".rbc-events-container": {
          marginRight: "3px !important",
        },
      }}
    >
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        view={Views.WEEK}
        date={currentDate}
        onNavigate={onNavigate}
        toolbar={false}
        scrollToTime={scrollToTime}
        onSelectEvent={(event) => onSelectEvent?.(event)}
        formats={{
          eventTimeRangeFormat: () => "",
        }}
        components={{
          event: (props: { event: CalendarEvent }) => (
            <EventComponent event={props.event} onSelectEvent={onSelectEvent} />
          ),
          week: {
            header: CustomHeader,
          },
        }}
        style={{
          flex: 1,
          height: "100%",
        }}
        eventPropGetter={(event) => {
          const statusClass = `status-${event.task_status.toLowerCase()}`;

          if (event.allDay) {
            return {
              className: statusClass,
              style: {
                backgroundColor: getTaskStatusColor(event.task_status),
                color: "white",
                border: "none",
              },
            };
          }

          return {
            className: statusClass,
            style: {
              backgroundColor: getTaskStatusBgColor(event.task_status),
              borderColor: getTaskStatusColor(event.task_status),
              color: getTaskStatusColor(event.task_status),
            },
          };
        }}
      />
    </Box>
  );
}

import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarEvent } from "./ScheduleTypes";
import {
  getTaskStatusColor,
  getTaskStatusBgColor,
  getDayNameMapping,
  formatTimeRange,
} from "../../../../utils/scheduleUtils";
import { CommentIcon } from "./CustomIcons";

const localizer = momentLocalizer(moment);

interface ScheduleCalendarProps {
  events: CalendarEvent[];
  allDayEvents: CalendarEvent[];
  currentDate: Date;
  onNavigate: (date: Date) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
  scrollToTime?: Date;
  isParticipant?: boolean; // participant view (vs. admin view)
}

// Custom header component for calendar
const CustomHeader: React.FC<{ date: Date; isParticipant?: boolean }> = ({
  date,
  isParticipant = false,
}) => {
  const dayNames = getDayNameMapping();

  const dayAbbr = moment(date).format("ddd").toUpperCase();
  const dayName = isParticipant
    ? moment(date).format("dd").charAt(0).toUpperCase() // Casing is different for participant calendar
    : dayNames[dayAbbr] || dayAbbr;
  const dayNumber = moment(date).format("D");
  const isToday = moment(date).isSame(moment(), "day");

  return (
    <Box
      textAlign="center"
      py={2}
      px={2}
      minH={isParticipant ? "0px" : "80px"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Text
        textStyle={isParticipant ? "mobile.b2" : "web.b2"}
        mb={isParticipant ? 0 : 2}
        letterSpacing="0.5px"
      >
        {dayName}
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
          fontWeight={isParticipant ? 700 : 400}
          textStyle={isParticipant ? "mobile.b1" : "web.b1"}
          textAlign="center"
          color={isToday ? "white" : "black"}
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
  isParticipant?: boolean;
}> = ({ event, onSelectEvent, isParticipant = false }) => {
  const isAllDay = !!event.allDay;
  const statusColor = getTaskStatusColor(event.task_status);
  const statusBgColor = getTaskStatusBgColor(event.task_status);

  return (
    <Flex
      w="100%"
      h="100%"
      padding={isParticipant ? "3px 2px" : isAllDay ? "3px 10px" : "10px"}
      bg={statusBgColor}
      color={statusColor}
      borderLeft={`${isParticipant ? 2 : 5}px solid ${statusColor}`}
      borderRadius="6px"
      textStyle={isParticipant ? "mobile.b2" : "web.b2"}
      cursor="pointer"
      onClick={() => onSelectEvent?.(event)}
      direction="column"
      gap="2px"
    >
      <div
        style={{
          fontWeight: isParticipant ? 500 : 700,
          marginBottom: !isParticipant && !isAllDay ? "2px" : 0,
        }}
      >
        {event.title}
      </div>
      {!isParticipant && !isAllDay && (
        <Text textStyle="web.b2" color="currentColor">
          {formatTimeRange(event.start, event.end)}
        </Text>
      )}
      {!isParticipant && !isAllDay && event.comment && (
        <div style={{ marginTop: "2px" }}>
          <CommentIcon size={12} color="currentColor" />
        </div>
      )}
    </Flex>
  );
};

export default function ScheduleCalendar({
  events,
  allDayEvents,
  currentDate,
  onNavigate,
  onSelectEvent,
  scrollToTime = moment().hour(7).minute(0).toDate(),
  isParticipant = false,
}: ScheduleCalendarProps) {
  // Combine regular events with all-day events
  const allEvents = [...events, ...allDayEvents];

  return (
    <Box
      w="100%"
      h="100%"
      minH={0}
      display="flex"
      flexDirection="column"
      id="react-big-calendar-container"
      data-participant={isParticipant ? "true" : "false"}
      overflow="hidden"
    >
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        date={currentDate}
        onNavigate={onNavigate}
        toolbar={false}
        scrollToTime={scrollToTime}
        min={scrollToTime}
        formats={{
          eventTimeRangeFormat: () => "",
          timeGutterFormat: isParticipant ? "h:mm" : "h:mm A",
        }}
        components={{
          event: (props: { event: CalendarEvent }) => (
            <EventComponent
              event={props.event}
              onSelectEvent={onSelectEvent}
              isParticipant={isParticipant}
            />
          ),
          week: {
            header: (props: { date: Date }) => (
              <CustomHeader date={props.date} isParticipant={isParticipant} />
            ),
          },
        }}
        style={{
          flex: 1,
          height: "100%",
        }}
        eventPropGetter={() => ({
          style: {
            padding: "0px",
          },
        })}
      />
    </Box>
  );
}

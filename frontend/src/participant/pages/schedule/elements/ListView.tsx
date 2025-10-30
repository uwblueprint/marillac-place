import React, { useEffect, useRef } from "react";
import { VStack, Text, HStack, Divider, Box } from "@chakra-ui/react";
import moment from "moment";
import { CalendarEvent } from "../../../../admin/pages/schedule/components/ScheduleTypes";
import { formatTimeRange } from "../../../../utils/scheduleUtils";
import TaskStatusBadge from "../../../../components/icons/TaskStatusBadge";
import { CommentIcon } from "../../../../admin/pages/schedule/components/CustomIcons";
import colors from "../../../../theme/colors";

interface ParticipantListViewProps {
  regularEvents: CalendarEvent[];
  allDayEvents: CalendarEvent[];
  currentDate: Date;
  onTaskSelect: (event: CalendarEvent) => void;
}

const DaySection: React.FC<{
  date: Date;
  events: CalendarEvent[];
  onTaskSelect: (event: CalendarEvent) => void;
  showHeader?: boolean;
}> = ({ date, events, onTaskSelect, showHeader = true }) => {
  if (events.length === 0) return null;
  return (
    <VStack align="stretch" spacing={2}>
      {showHeader && (
        <Text textStyle="web.h3" color="black">
          {moment(date).format("dddd, MMM D")}
        </Text>
      )}
      {events.map((e) => (
        <HStack
          key={e.id}
          justify="space-between"
          onClick={() => onTaskSelect(e)}
          cursor="pointer"
        >
          <HStack spacing={3}>
            <TaskStatusBadge status={e.task_status} />
            <HStack spacing={2}>
              <Text textStyle="web.c1" color="black">
                {e.title}
              </Text>
              {e.comment && (
                <CommentIcon size={10} color={colors.text.light.secondary} />
              )}
            </HStack>
          </HStack>
          <Text textStyle="web.c1" color={colors.text.light.secondary}>
            {e.allDay ? "Anytime" : formatTimeRange(e.start, e.end)}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
};

export default function ParticipantListView({
  regularEvents,
  allDayEvents,
  currentDate,
  onTaskSelect,
}: ParticipantListViewProps) {
  const todayRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    todayRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [currentDate]);
  const startOfWeek = moment(currentDate).startOf("week");
  const days = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.clone().add(i, "day")
  );

  const allEvents = [...regularEvents, ...allDayEvents];
  const eventsByDay: Record<string, CalendarEvent[]> = {};
  days.forEach((d) => {
    const key = d.format("YYYY-MM-DD");
    eventsByDay[key] = [];
  });
  allEvents.forEach((e: CalendarEvent) => {
    const key = moment(e.start).format("YYYY-MM-DD");
    if (!eventsByDay[key]) eventsByDay[key] = [];
    eventsByDay[key].push(e);
  });

  const anyTime = allEvents.filter((e: CalendarEvent) => e.allDay);

  return (
    <VStack align="stretch" spacing="10px">
      {anyTime.length > 0 && (
        <VStack align="stretch" spacing={0}>
          <Text textStyle="web.h3" color="black">
            Anytime
          </Text>
          <Divider />
          <Box pt="8px" pb="8px">
            <DaySection
              date={currentDate}
              events={anyTime}
              onTaskSelect={onTaskSelect}
              showHeader={false}
            />
          </Box>
        </VStack>
      )}

      {days.map((d, i) => {
        const isToday = d.isSame(moment(currentDate), "day");
        return (
          <Box key={d.toString()} ref={isToday ? todayRef : undefined}>
            <Divider />
            <Box pt="8px" pb="8px">
              <DaySection
                date={d.toDate()}
                events={eventsByDay[d.format("YYYY-MM-DD")] || []}
                onTaskSelect={onTaskSelect}
              />
            </Box>
          </Box>
        );
      })}
    </VStack>
  );
}

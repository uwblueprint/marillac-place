export {};
// TODO: Refactor this component
// import React from "react";
// import { Box, Text, Flex } from "@chakra-ui/react";
// import { Calendar, momentLocalizer, Views } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { CalendarEvent, TaskStatus } from "./ScheduleTypes";
// import {
//   getTaskStatusColor,
//   getTaskStatusBgColor,
//   getDayNameMapping,
//   formatEventTime,
// } from "../../../../utils/scheduleUtils";
// import { CommentIcon } from "./CustomIcons";
// import colors from "../../../../theme/colors";
// import { TaskType } from "../../../../types/task";
// 
// const localizer = momentLocalizer(moment);
// 
// interface ScheduleCalendarProps {
//   events: CalendarEvent[];
//   allDayEvents: CalendarEvent[];
//   currentDate: Date;
//   onNavigate: (date: Date) => void;
//   onSelectEvent?: (event: CalendarEvent) => void;
//   scrollToTime?: Date;
// }
// 
// // Custom header component for calendar
// const CustomHeader: React.FC<{ date: Date }> = ({ date }) => {
//   const dayNames = getDayNameMapping();
// 
//   const dayAbbr = moment(date).format("ddd").toUpperCase();
//   const dayName = dayNames[dayAbbr] || dayAbbr;
//   const dayNumber = moment(date).format("D");
//   const isToday = moment(date).isSame(moment(), "day");
// 
//   return (
//     <Box
//       textAlign="center"
//       py={2}
//       px={2}
//       minH="80px"
//       display="flex"
//       flexDirection="column"
//       justifyContent="center"
//     >
//       <Text textStyle="web.b2" mb={1} letterSpacing="0.3px">
//         {dayName}
//       </Text>
//       <Box
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         w="27px"
//         h="27px"
//         borderRadius="full"
//         bg={isToday ? "secondary.700" : "transparent"}
//         cursor="default"
//         margin="0"
//         padding="0"
//       >
//         <Text
//           textStyle="web.b1"
//           textAlign="center"
//           color={isToday ? "white" : "black"}
//         >
//           {dayNumber}
//         </Text>
//       </Box>
//     </Box>
//   );
// };
// 
// // Custom event component for calendar
// const EventComponent: React.FC<{
//   event: CalendarEvent;
//   onSelectEvent?: (event: CalendarEvent) => void;
// }> = ({ event, onSelectEvent }) => {
//   // For all-day events, use simpler styling
//   if (event.allDay) {
//     return (
//       <Text color="inherit" textStyle="web.s1" pt="1px">
//         {event.task_type === TaskType.INDIVIDUAL_GOAL
//           ? event.goalName
//           : event.title}
//       </Text>
//     );
//   }
// 
//   // For timed events, show name on top and time underneath
//   return (
//     <Flex
//       padding="4px"
//       cursor="pointer"
//       onClick={() => onSelectEvent?.(event)}
//       direction="column"
//       gap="2px"
//     >
//       <Text color="inherit" textStyle="web.s1">
//         {event.title}
//       </Text>
//       <Text color="inherit" fontSize="10px">
//         {formatEventTime(event.start, event.end)}
//       </Text>
//       {event.comment && (
//         <div style={{ margin: "2px" }}>
//           <CommentIcon size={12} color="currentColor" />
//         </div>
//       )}
//     </Flex>
//   );
// };
// 
// export default function ScheduleCalendar({
//   events,
//   allDayEvents,
//   currentDate,
//   onNavigate,
//   onSelectEvent,
//   scrollToTime = moment().hour(7).minute(0).toDate(),
// }: ScheduleCalendarProps) {
//   // Combine regular events with all-day events
//   const allEvents = [...events, ...allDayEvents];
// 
//   // Set CSS custom properties from theme colors
//   React.useEffect(() => {
//     const root = document.documentElement;
//     root.style.setProperty(
//       "--status-complete",
//       getTaskStatusColor(TaskStatus.COMPLETE)
//     );
//     root.style.setProperty(
//       "--status-assigned",
//       getTaskStatusColor(TaskStatus.ASSIGNED)
//     );
//     root.style.setProperty(
//       "--status-incomplete",
//       getTaskStatusColor(TaskStatus.INCOMPLETE)
//     );
//     root.style.setProperty(
//       "--status-excused",
//       getTaskStatusColor(TaskStatus.EXCUSED)
//     );
// 
//     root.style.setProperty("--status-complete-bg", colors.actionsLight.green);
//     root.style.setProperty("--status-assigned-bg", colors.actionsLight.blue);
//     root.style.setProperty("--status-incomplete-bg", colors.actionsLight.red);
//     root.style.setProperty("--status-excused-bg", colors.actionsLight.yellow);
// 
//     root.style.setProperty("--status-complete-text", colors.actionsDark.green);
//     root.style.setProperty("--status-assigned-text", colors.actionsDark.blue);
//     root.style.setProperty("--status-incomplete-text", colors.actionsDark.red);
//     root.style.setProperty("--status-excused-text", colors.actionsDark.yellow);
//   }, []);
// 
//   return (
//     <Box
//       w="100%"
//       h="100%"
//       minH={0}
//       display="flex"
//       flexDirection="column"
//       id="react-big-calendar-container"
//       overflow="hidden"
//       sx={{
//         // Override calendar styles
//         ".rbc-time-gutter .rbc-label": {
//           fontFamily: "Nunito !important",
//           fontWeight: "400 !important",
//           color: "black !important",
//         },
//         ".rbc-time-gutter .rbc-time-column": {
//           backgroundColor: "transparent !important",
//         },
//         ".rbc-events-container": {
//           marginRight: "0px !important",
//         },
//       }}
//     >
//       <Calendar
//         localizer={localizer}
//         events={allEvents}
//         startAccessor="start"
//         endAccessor="end"
//         view={Views.WEEK}
//         date={currentDate}
//         onNavigate={onNavigate}
//         toolbar={false}
//         scrollToTime={scrollToTime}
//         min={scrollToTime}
//         onSelectEvent={(event) => onSelectEvent?.(event)}
//         formats={{
//           eventTimeRangeFormat: () => "",
//         }}
//         components={{
//           event: (props: { event: CalendarEvent }) => (
//             <EventComponent event={props.event} onSelectEvent={onSelectEvent} />
//           ),
//           week: {
//             header: CustomHeader,
//           },
//         }}
//         style={{
//           flex: 1,
//           height: "100%",
//         }}
//         eventPropGetter={(event) => {
//           const statusClass = `status-${event.task_status.toLowerCase()}`;
// 
//           if (event.allDay) {
//             return {
//               className: statusClass,
//               style: {
//                 backgroundColor: getTaskStatusColor(event.task_status),
//                 color: "white",
//                 border: "none",
//               },
//             };
//           }
// 
//           return {
//             className: statusClass,
//             style: {
//               backgroundColor: getTaskStatusBgColor(event.task_status),
//               borderColor: getTaskStatusColor(event.task_status),
//               color: getTaskStatusColor(event.task_status),
//             },
//           };
//         }}
//       />
//     </Box>
//   );
// }

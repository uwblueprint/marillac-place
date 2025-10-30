import moment from "moment";
import { TaskStatus } from "../admin/pages/schedule/components/ScheduleTypes";
import colors from "../theme/colors";

// Get task status color (text color)
export const getTaskStatusColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETE:
      return colors.actionsDark.green; // #0D8312
    case TaskStatus.ASSIGNED:
      return colors.actionsDark.blue; // #255B9A
    case TaskStatus.INCOMPLETE:
      return colors.actionsDark.red; // #B21D2F
    case TaskStatus.EXCUSED:
      return colors.actionsDark.yellow; // #B07D18
    default:
      return colors.text.light.disabled; // #6C707A
  }
};

// Get task status background color
export const getTaskStatusBgColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETE:
      return colors.actionsLight.green; // #CDEECE
    case TaskStatus.ASSIGNED:
      return colors.actionsLight.blue; // #C5DCF8
    case TaskStatus.INCOMPLETE:
      return colors.actionsLight.red; // #F8D7DB
    case TaskStatus.EXCUSED:
      return colors.actionsLight.yellow; // #FFE5B2
    default:
      return colors.neutral[100]; // #FAFAFA
  }
};

// Get task status display text
export const getTaskStatusText = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETE:
      return "Completed";
    case TaskStatus.ASSIGNED:
      return "Assigned";
    case TaskStatus.INCOMPLETE:
      return "Incomplete";
    case TaskStatus.EXCUSED:
      return "Excused";
    default:
      return "Unknown";
  }
};

// Format task time display
export const formatTaskTime = (startDate: string, endDate: string): string => {
  if (startDate === "Anytime" || endDate === "Anytime") {
    return "Anytime";
  }

  // Try to parse the date strings and extract time only
  const parseTimeOnly = (dateString: string): string => {
    // If it's already just a time (like "9:00 am"), return as is
    if (dateString.match(/^\d{1,2}:\d{2}\s?(am|pm|AM|PM)?$/)) {
      return dateString;
    }

    // Try to parse as full date-time and extract time
    const parsedDate = moment(dateString);
    if (parsedDate.isValid()) {
      return parsedDate.format("h:mm A");
    }

    // If parsing fails, return the original string
    return dateString;
  };

  const startTime = parseTimeOnly(startDate);
  const endTime = parseTimeOnly(endDate);

  if (startTime === endTime) {
    return startTime;
  }
  return `${startTime} - ${endTime}`;
};

// Get current week range for display
export const getCurrentWeekRange = (currentDate: Date): string => {
  const startOfWeek = moment(currentDate).startOf("week");
  const endOfWeek = moment(currentDate).endOf("week");
  const startMonth = startOfWeek.format("MMM");
  const endMonth = endOfWeek.format("MMM");

  if (startMonth === endMonth) {
    return `${startMonth} ${startOfWeek.format("D")} - ${endOfWeek.format(
      "D"
    )}`;
  }
  return `${startOfWeek.format("MMM D")} - ${endOfWeek.format("MMM D")}`;
};

// Get days of the current week
export const getDaysOfWeek = (currentDate: Date) => {
  const startOfWeek = moment(currentDate).startOf("week");
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const day = startOfWeek.clone().add(i, "days");
    days.push({
      name: day.format("dddd"),
      shortName: day.format("ddd").toUpperCase(),
      date: day.toDate(),
      isToday: day.isSame(moment(), "day"),
    });
  }
  return days;
};

// Custom day name mapping to match design
export const getDayNameMapping = (): { [key: string]: string } => ({
  SUN: "SUN",
  MON: "MON",
  TUE: "TUES",
  WED: "WED",
  THU: "THUR",
  FRI: "FRI",
  SAT: "SAT",
});

// Format a single time for display
export const formatTime = (
  date: Date,
  options?: { showMeridiem?: boolean }
): string => {
  const showMeridiem = options?.showMeridiem !== false;
  const fmt = showMeridiem ? "h:mm A" : "h:mm";
  return moment(date).format(fmt);
};

// Format an event time range using single-time formatter
export const formatTimeRange = (
  start: Date,
  end: Date,
  showMeridiem = true
): string => {
  const startTime = formatTime(start, { showMeridiem });
  const endTime = formatTime(end, { showMeridiem });
  if (startTime === endTime) {
    return startTime;
  }
  return `${startTime} - ${endTime}`;
};

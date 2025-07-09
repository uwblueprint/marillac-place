import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import {
  ParticipantData,
  TaskStatus,
  TaskType,
  CalendarEvent,
} from "../types/ScheduleTypes";

export const useScheduleData = (selectedRoom: number, currentDate: Date) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    localStorage.setItem("scheduleSelectedRoom", selectedRoom.toString());
  }, [selectedRoom]);

  // Create calendar events that work for both views
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const currentWeekStart = moment(currentDate).startOf("week");
    const events: CalendarEvent[] = [];

    // All-day events
    events.push({
      id: 1,
      title: "Room Inspection",
      start: moment(currentWeekStart).add(1, "days").toDate(),
      end: moment(currentWeekStart).add(1, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 10,
      marillac_bucks_deduction: 0,
      comment: undefined,
    });

    events.push({
      id: 2,
      title: "Weekly Chores",
      start: moment(currentWeekStart).add(2, "days").toDate(),
      end: moment(currentWeekStart).add(4, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 15,
      marillac_bucks_deduction: 0,
      comment: "Great job completing early!",
    });

    events.push({
      id: 3,
      title: "Community Service",
      start: moment(currentWeekStart).add(5, "days").toDate(),
      end: moment(currentWeekStart).add(5, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.INCOMPLETE,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 25,
      marillac_bucks_deduction: 5,
      comment: undefined,
    });

    events.push({
      id: 9,
      title: "House Cleaning",
      start: moment(currentWeekStart).add(0, "days").toDate(),
      end: moment(currentWeekStart).add(0, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 15,
      marillac_bucks_deduction: 0,
      comment: undefined,
    });

    events.push({
      id: 10,
      title: "Job Search Activities",
      start: moment(currentWeekStart).add(1, "days").toDate(),
      end: moment(currentWeekStart).add(3, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.INDIVIDUAL_GOAL,
      marillacBucksAddition: 30,
      marillac_bucks_deduction: 0,
      comment: undefined,
    });

    events.push({
      id: 11,
      title: "Meal Planning",
      start: moment(currentWeekStart).add(6, "days").toDate(),
      end: moment(currentWeekStart).add(6, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.OPTIONAL,
      marillacBucksAddition: 10,
      marillac_bucks_deduction: 0,
      comment: "Well planned meals for the week!",
    });

    events.push({
      id: 12,
      title: "Personal Development Workshop",
      start: moment(currentWeekStart).add(3, "days").toDate(),
      end: moment(currentWeekStart).add(5, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.OPTIONAL,
      marillacBucksAddition: 40,
      marillac_bucks_deduction: 0,
      comment: "Excellent participation throughout the workshop!",
    });

    events.push({
      id: 13,
      title: "Apartment Viewing",
      start: moment(currentWeekStart).add(4, "days").toDate(),
      end: moment(currentWeekStart).add(4, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.EXCUSED,
      task_type: TaskType.INDIVIDUAL_GOAL,
      marillacBucksAddition: 20,
      marillac_bucks_deduction: 0,
      comment: "Cancelled due to scheduling conflict",
    });

    events.push({
      id: 14,
      title: "Life Skills Training",
      start: moment(currentWeekStart).add(0, "days").toDate(),
      end: moment(currentWeekStart).add(2, "days").toDate(),
      allDay: true,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 35,
      marillac_bucks_deduction: 0,
      comment: undefined,
    });

    // Timed events
    events.push({
      id: 4,
      title: "Therapy Session",
      start: moment(currentWeekStart)
        .add(1, "days")
        .hour(14)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(1, "days").hour(15).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 20,
      marillac_bucks_deduction: 0,
      comment: undefined,
    });

    events.push({
      id: 5,
      title: "Skills Assessment",
      start: moment(currentWeekStart)
          .add(1, "days")
          .hour(10)
          .minute(0)
          .toDate(),
      end: moment(currentWeekStart).add(1, "days").hour(11).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 30,
      marillac_bucks_deduction: 0,
      comment: "Excellent progress!",
    });

    events.push({
      id: 5,
      title: "Skills Assessment",
      start: moment(currentWeekStart)
        .add(2, "days")
        .hour(10)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(2, "days").hour(11).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 30,
      marillac_bucks_deduction: 0,
      comment: "Excellent progress!",
    });

    events.push({
      id: 6,
      title: "Group Meeting",
      start: moment(currentWeekStart)
        .add(3, "days")
        .hour(13)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(3, "days").hour(14).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.OPTIONAL,
      marillacBucksAddition: 15,
      marillac_bucks_deduction: 0,
      comment: undefined,
    });

    events.push({
      id: 7,
      title: "Job Interview Prep",
      start: moment(currentWeekStart).add(4, "days").hour(9).minute(0).toDate(),
      end: moment(currentWeekStart).add(4, "days").hour(10).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.EXCUSED,
      task_type: TaskType.INDIVIDUAL_GOAL,
      marillacBucksAddition: 25,
      marillac_bucks_deduction: 0,
      comment: "Rescheduled due to medical appointment",
    });

    events.push({
      id: 8,
      title: "Financial Planning",
      start: moment(currentWeekStart)
        .add(5, "days")
        .hour(11)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(5, "days").hour(12).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.INDIVIDUAL_GOAL,
      marillacBucksAddition: 20,
      marillac_bucks_deduction: 0,
      comment: undefined,
    });

    return events;
  }, [currentDate]);

  // Participant data uses the same events
  const participantData: ParticipantData | null = useMemo(() => {
    if (selectedRoom === 1) {
      return {
        participant_id: 1,
        room_number: 1,
        marillac_bucks: 125,
        assigned_tasks: calendarEvents,
      };
    }
    if (selectedRoom === 3) {
      return {
        participant_id: 2,
        room_number: 3,
        marillac_bucks: 95,
        assigned_tasks: calendarEvents,
      };
    }
    if (selectedRoom === 7) {
      return {
        participant_id: 3,
        room_number: 7,
        marillac_bucks: 75,
        assigned_tasks: calendarEvents,
      };
    }
    return null;
  }, [selectedRoom, calendarEvents]);

  // Separate regular and all-day events for calendar
  const regularEvents = calendarEvents.filter((event) => !event.allDay);
  const allDayEvents = calendarEvents.filter((event) => event.allDay);

  return {
    loading,
    error,
    participantData,
    regularEvents,
    allDayEvents,
  };
};

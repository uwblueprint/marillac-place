import { useState, useMemo } from "react";
import moment from "moment";
import {
  ParticipantData,
  TaskStatus,
  TaskType,
  CalendarEvent,
} from "./ScheduleTypes";

export const useScheduleData = (selectedRoom: number, currentDate: Date) => {
  // Mock data for now - this will be replaced with actual API calls
  const participantData: ParticipantData = {
    participant_id: 1,
    room_number: selectedRoom,
    marillac_bucks: 150,
    assigned_tasks: [],
  };

  const currentWeekStart = moment(currentDate).startOf("week");

  // Mock events for testing
  const regularEvents: CalendarEvent[] = [
    {
      id: 1,
      title: "Morning Exercise",
      start: moment(currentWeekStart).hour(8).minute(0).toDate(),
      end: moment(currentWeekStart).hour(9).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 10,
      marillacBucksDeduction: 0,
      comment: undefined,
    },
    {
      id: 2,
      title: "Study Session",
      start: moment(currentWeekStart)
        .add(1, "days")
        .hour(14)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(1, "days").hour(16).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 15,
      marillacBucksDeduction: 0,
      comment: "Great job completing early!",
    },
    {
      id: 3,
      title: "Group Therapy",
      start: moment(currentWeekStart)
        .add(2, "days")
        .hour(10)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(2, "days").hour(11).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.INCOMPLETE,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 25,
      marillacBucksDeduction: 5,
      comment: undefined,
    },
    {
      id: 4,
      title: "Art Workshop",
      start: moment(currentWeekStart)
        .add(3, "days")
        .hour(15)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(3, "days").hour(17).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 15,
      marillacBucksDeduction: 0,
      comment: undefined,
    },
    {
      id: 5,
      title: "Personal Goal: Learn Spanish",
      start: moment(currentWeekStart)
        .add(4, "days")
        .hour(19)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(4, "days").hour(20).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.INDIVIDUAL_GOAL,
      marillacBucksAddition: 30,
      marillacBucksDeduction: 0,
      comment: undefined,
    },
    {
      id: 6,
      title: "Meal Planning",
      start: moment(currentWeekStart)
        .add(5, "days")
        .hour(16)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(5, "days").hour(17).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.OPTIONAL,
      marillacBucksAddition: 10,
      marillacBucksDeduction: 0,
      comment: "Well planned meals for the week!",
    },
    {
      id: 7,
      title: "Life Skills Workshop",
      start: moment(currentWeekStart)
        .add(6, "days")
        .hour(13)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(6, "days").hour(15).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.COMPLETE,
      task_type: TaskType.OPTIONAL,
      marillacBucksAddition: 40,
      marillacBucksDeduction: 0,
      comment: "Excellent participation throughout the workshop!",
    },
    {
      id: 8,
      title: "Personal Goal: Reading",
      start: moment(currentWeekStart)
        .add(1, "days")
        .hour(20)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(1, "days").hour(21).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.EXCUSED,
      task_type: TaskType.INDIVIDUAL_GOAL,
      marillacBucksAddition: 20,
      marillacBucksDeduction: 0,
      comment: "Cancelled due to scheduling conflict",
    },
    {
      id: 9,
      title: "Community Service",
      start: moment(currentWeekStart).add(3, "days").hour(9).minute(0).toDate(),
      end: moment(currentWeekStart).add(3, "days").hour(12).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 35,
      marillacBucksDeduction: 0,
      comment: undefined,
    },
  ];

  const allDayEvents: CalendarEvent[] = [
    {
      id: 10,
      title: "Weekly Reflection",
      start: moment(currentWeekStart).hour(0).minute(0).toDate(),
      end: moment(currentWeekStart).hour(23).minute(59).toDate(),
      allDay: true,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.REQUIRED,
      marillacBucksAddition: 20,
      marillacBucksDeduction: 0,
      comment: undefined,
    },
    {
      id: 11,
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
      marillacBucksDeduction: 0,
      comment: "Excellent progress!",
    },
    {
      id: 12,
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
      marillacBucksDeduction: 0,
      comment: "Excellent progress!",
    },
    {
      id: 13,
      title: "Volunteer Work",
      start: moment(currentWeekStart)
        .add(4, "days")
        .hour(14)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(4, "days").hour(16).minute(0).toDate(),
      allDay: false,
      task_status: TaskStatus.ASSIGNED,
      task_type: TaskType.OPTIONAL,
      marillacBucksAddition: 15,
      marillacBucksDeduction: 0,
      comment: undefined,
    },
    {
      id: 14,
      title: "Personal Goal: Fitness",
      start: moment(currentWeekStart)
        .add(5, "days")
        .hour(18)
        .minute(0)
        .toDate(),
      end: moment(currentWeekStart).add(5, "days").hour(19).minute(30).toDate(),
      allDay: false,
      task_status: TaskStatus.EXCUSED,
      task_type: TaskType.INDIVIDUAL_GOAL,
      marillacBucksAddition: 25,
      marillacBucksDeduction: 0,
      comment: "Rescheduled due to medical appointment",
    },
  ];

  return {
    loading: false,
    error: null,
    participantData,
    regularEvents,
    allDayEvents,
  };
};

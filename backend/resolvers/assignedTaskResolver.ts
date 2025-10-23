import prisma from "../prisma";
import {
  AssignedTask,
  TaskType,
  Status
} from "@prisma/client";
import { formatDateFromDateString, formatDateTime, getWeekBounds } from "../utils/formatDateTime";

type CalendarEvent = {
  id: number;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  task_status: Status;
  task_type: TaskType;
  marillacBucksAddition: number;
  marillac_bucks_deduction: number;
  comment: string | null;
}

function convertAssignedTaskToCalendarEvent(task: AssignedTask, is_specific: boolean): CalendarEvent {
  const event: CalendarEvent = {
    id: task.assigned_task_id,
    title: task.task_name,
    start: task.start_date,
    end: task.end_date,
    allDay: !is_specific,
    task_status: task.task_status,
    task_type: task.task_type,
    marillacBucksAddition: task.marillac_bucks_addition,
    marillac_bucks_deduction: task.marillac_bucks_deduction,
    comment: task.comment,
  }
  return event
}

function groupTasks(tasks: AssignedTask[]) {
  const specific: CalendarEvent[] = [];
  const anytime: CalendarEvent[] = [];
  const anyday: CalendarEvent[] = [];
  const { weekStart, weekEnd } = getWeekBounds();

  for (const task of tasks) {
    if (task.start_date < weekStart || task.start_date > weekEnd) {
      continue;
    }

    const start = formatDateFromDateString(task.start_date);
    const end = formatDateFromDateString(task.end_date);

    const isSameDay = start.toDateString() === end.toDateString();
    const isDayStart = start.getHours() === 0 && start.getMinutes() === 0;
    const isDayEnd = end.getHours() === 23 && end.getMinutes() === 59;

    if (!isSameDay) {
      anyday.push(convertAssignedTaskToCalendarEvent(task, false));
      continue;
    }

    if (isDayStart && isDayEnd) {
      anytime.push(convertAssignedTaskToCalendarEvent(task, false));
    } else {
      specific.push(convertAssignedTaskToCalendarEvent(task, true));
    }
  }

  return {
    SPECIFIC: specific,
    ANYTIME: anytime,
    ANYDAY: anyday,
  };
}

const assignedTaskResolver = {
  Query: {
    hasCompletedAllRequiredTasks: async (
      _parent: undefined,
      { participantId }: { participantId: number }
    ): Promise<boolean> => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      const monday = new Date(today);
      monday.setDate(today.getDate() - daysFromMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const weekStart = formatDateTime(monday, false);
      const weekEnd = formatDateTime(sunday, false);

      // Get all required tasks assigned to this participant for the current week
      const requiredTasks = await prisma.assignedTask.findMany({
        where: {
          participant_id: participantId,
          task_type: TaskType.REQUIRED,
          start_date: {
            gte: weekStart,
          },
          end_date: {
            lte: weekEnd,
          },
        },
      });

      // If no required tasks are assigned, consider it as completed
      if (requiredTasks.length === 0) {
        return true;
      }

      // Check if all required tasks are completed
      const completedTasks = requiredTasks.filter(
        (task) => task.task_status === "COMPLETE"
      );

      return completedTasks.length === requiredTasks.length;
    },
    getAssignedTasks: async (
      _parent: undefined,
      { participant_id }: { participant_id: number },
    ): Promise<{
      SPECIFIC: CalendarEvent[]
      ANYTIME: CalendarEvent[];
      ANYDAY: CalendarEvent[];
    }> => {
      const assignedTasks = await prisma.assignedTask.findMany({
	      where: { participant_id: participant_id },
      });
      return groupTasks(assignedTasks);
    },
  },
  Mutation: {
    deleteAssignedTask: async (
      _parent: undefined,
      { assigned_task_id }: { assigned_task_id: number }
    ): Promise<boolean> => {
      await prisma.assignedTask.delete({
        where: { assigned_task_id: assigned_task_id },
      });
      return true;
    },
    updateAssignedTask: async (
      _parent: undefined,
      {
        id,
        taskName,
        taskStatus,
        taskType,
        goalName,
        goalDescription,
        startDate,
        endDate,
        marillacBucksAddition,
        marillacBucksDeduction,
        comment,
      }: {
        id: number;
        taskName?: string;
        taskStatus?: Status;
        taskType?: TaskType;
        goalName?: string;
        goalDescription?: string;
        startDate?: string;
        endDate?: string;
        marillacBucksAddition?: number;
        marillacBucksDeduction?: number;
        comment?: string;
      }
    ): Promise<boolean> => {
      const updatedData: Record<string, any> = {};

      if (taskName) updatedData.task_name = taskName;
      if (taskType) updatedData.task_type = taskType;
      if (taskStatus) updatedData.task_status = taskStatus;
      if (goalName) updatedData.goal_name = goalName;
      if (goalDescription) updatedData.goal_description = goalDescription;
      if (startDate) updatedData.start_date = startDate;
      if (endDate) updatedData.end_date = endDate;
      if (marillacBucksAddition) updatedData.marillac_bucks_addition = marillacBucksAddition;
      if (marillacBucksDeduction) updatedData.marillac_bucks_deduction = marillacBucksDeduction;
      if (comment) updatedData.comment = comment;

      await prisma.assignedTask.update({
        where: { assigned_task_id: id },
        data: updatedData,
      });

      return true;
    },
    createAssignedTask: async (
      _parent: undefined,
      {
        participantId,
        taskName,
        startDate,
        endDate,
        marillacBucksAddition,
        marillacBucksDeduction,
        taskType,
        goalName,
        goalDescription,
        comment,
      }: {
        participantId: number;
        taskName: string;
        startDate: string;
        endDate: string;
        marillacBucksAddition: number;
        marillacBucksDeduction: number;
        taskType: TaskType;
        goalName?: string;
        goalDescription?: string;
        comment?: string;
      }
    ): Promise<boolean> => {
      await prisma.assignedTask.create({
        data: {
          participant_id: participantId,
          task_name: taskName,
          start_date: startDate,
          end_date: endDate,
          marillac_bucks_addition: marillacBucksAddition,
          marillac_bucks_deduction: marillacBucksDeduction,
          task_type: taskType,
          goal_name: goalName,
          goal_description: goalDescription,
          comment,
        },
      });
      return true;
    }
  },
};

export default assignedTaskResolver;

import prisma from "../prisma";
import {
  AssignedTask,
  TaskType
} from "@prisma/client";
import { getWeekBounds } from "../utils/formatDateTime";

type AssignedTaskGroup = {
  SPECIFIC: AssignedTask[];
  ANYTIME: AssignedTask[];
};

function groupTasks(tasks: AssignedTask[]) {
  const dayMap: Record<string, AssignedTaskGroup> = {
    MONDAY: { SPECIFIC: [], ANYTIME: [] },
    TUESDAY: { SPECIFIC: [], ANYTIME: [] },
    WEDNESDAY: { SPECIFIC: [], ANYTIME: [] },
    THURSDAY: { SPECIFIC: [], ANYTIME: [] },
    FRIDAY: { SPECIFIC: [], ANYTIME: [] },
    SATURDAY: { SPECIFIC: [], ANYTIME: [] },
    SUNDAY: { SPECIFIC: [], ANYTIME: [] },
  };

  const ANYDAY: AssignedTask[] = [];
  const { weekStart, weekEnd } = getWeekBounds();

  for (const task of tasks) {
    if (task.start_date < weekStart || task.start_date > weekEnd) {
      continue;
    }

    const start = new Date(task.start_date);
    const end = new Date(task.end_date);

    const isSameDay = start.toDateString() === end.toDateString();
    const isDayStart = start.getHours() === 0 && start.getMinutes() === 0;
    const isDayEnd = end.getHours() === 23 && end.getMinutes() === 59;

    if (!isSameDay) {
      ANYDAY.push(task);
      continue;
    }

    const weekday = start.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    if (isDayStart && isDayEnd) {
      dayMap[weekday].ANYTIME.push(task);
    } else {
      dayMap[weekday].SPECIFIC.push(task);
    }
  }

  return {
    ...dayMap,
    ANYDAY,
  };
}

const assignedTaskResolver = {
  Query: {
    getAssignedTasks: async (
      _parent: undefined,
      { participant_id }: { participant_id: number },
    ): Promise<{
      MONDAY?: {
        SPECIFIC: AssignedTask[];
        ANYTIME: AssignedTask[];
      };
      TUESDAY?: {
        SPECIFIC: AssignedTask[];
        ANYTIME: AssignedTask[];
      };
      WEDNESDAY?: {
        SPECIFIC: AssignedTask[];
        ANYTIME: AssignedTask[];
      };
      THURSDAY?: {
        SPECIFIC: AssignedTask[];
        ANYTIME: AssignedTask[];
      };
      FRIDAY?: {
        SPECIFIC: AssignedTask[];
        ANYTIME: AssignedTask[];
      };
      SATURDAY?: {
        SPECIFIC: AssignedTask[];
        ANYTIME: AssignedTask[];
      };
      SUNDAY?: {
        SPECIFIC: AssignedTask[];
        ANYTIME: AssignedTask[];
      };
      ANYDAY: AssignedTask[];
    }> => {
      const assignedTasks = await prisma.assignedTask.findMany({
	where: { participant_id: participant_id },
      });
      return groupTasks(assignedTasks);
    },
  },

  Mutation: {
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
      try {
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
      } catch (err) {
	throw new Error("Something went wrong");
      }
    },
  },
};

export default assignedTaskResolver;

import prisma from "../../prisma";
import {
  AssignedTask
} from "@prisma/client";
import IAssignedTaskService from "../interface/assignedTaskInterface";

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

  for (const task of tasks) {
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


class AssignedTaskService implements IAssignedTaskService {
  async getAssignedTasks(participant_id: number): Promise<{
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
}>
 {
    try {
      const assignedTasks = await prisma.assignedTask.findMany({
        where: { participant_id: participant_id },
      });
      return groupTasks(assignedTasks);
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
}

export default AssignedTaskService;

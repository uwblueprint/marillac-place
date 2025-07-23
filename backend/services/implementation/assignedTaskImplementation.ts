import { TaskType } from "@prisma/client";
import prisma from "../../prisma";
import IAssignedTaskService from "../interface/assignedTaskInterface";
import { formatDateTime } from "../../utils/formatDateTime";

class AssignedTaskService implements IAssignedTaskService {
  async createAssignedTask(
    participantId: number,
    taskName: string,
    startDate: string,
    endDate: string,
    marillacBucksAddition: number,
    marillacBucksDeduction: number,
    taskType: TaskType,
    goalName?: string,
    goalDescription?: string,
    comment?: string
  ): Promise<boolean> {
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
  }

  async hasCompletedAllRequiredTasks(participantId: number): Promise<boolean> {
    try {
      // Get the start and end of the current week (Monday to Sunday)
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
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
}

export default AssignedTaskService;

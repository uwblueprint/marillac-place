import { TaskType } from "@prisma/client";
import prisma from "../../prisma";
import IAssignedTaskService from "../interface/assignedTaskInterface";

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
}

export default AssignedTaskService;

import { Status, TaskType } from "@prisma/client";

interface IAssignedTaskService {
  createAssignedTask(
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
  ): Promise<boolean>;
  deleteAssignedTask(assignedTaskId: number): Promise<boolean>;
  editAssignedTask(
    assignedTaskId: number,
    goalName?: string,
    goalDescription?: string,
    startDate?: string,
    endDate?: string,
    taskStatus?: Status,
    marillacBucksAddition?: number,
    marillacBucksDeduction?: number,
    comment?: string
  ): Promise<boolean>;
}

export default IAssignedTaskService;

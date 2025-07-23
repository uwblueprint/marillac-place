import { TaskType } from "@prisma/client";

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

  hasCompletedAllRequiredTasks(participantId: number): Promise<boolean>;
}

export default IAssignedTaskService;

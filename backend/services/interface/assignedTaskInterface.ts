import {
  AssignedTask,
  TaskType
} from "@prisma/client";

interface IAssignedTaskService {
  getAssignedTasks(participant_id: number): Promise<{
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
  }>;
  
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
}

export default IAssignedTaskService;

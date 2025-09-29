import {
  AssignedTask,
  TaskType
} from "@prisma/client";
import AssignedTaskService from "../services/implementation/assignedTaskImplementation";
import IAssignedTaskService from "../services/interface/assignedTaskInterface";

const assignedTaskService: IAssignedTaskService = new AssignedTaskService();

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
      return assignedTaskService.getAssignedTasks(participant_id);
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
      return assignedTaskService.createAssignedTask(
        participantId,
        taskName,
        startDate,
        endDate,
        marillacBucksAddition,
        marillacBucksDeduction,
        taskType,
        goalName,
        goalDescription,
        comment
      );
    },
  },
};

export default assignedTaskResolver;

import { TaskType } from "@prisma/client";
import IAssignedTaskService from "../services/interface/assignedTaskInterface";
import AssignedTaskService from "../services/implementation/assignedTaskImplementation";

const assignedTaskService: IAssignedTaskService = new AssignedTaskService();

const assignedTaskResolver = {
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

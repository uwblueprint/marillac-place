import { Status, TaskType } from "@prisma/client";
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
    deleteAssignedTask: async (
      _parent: undefined,
      { assigned_task_id }: { assigned_task_id: number }
    ): Promise<boolean> => {
      return assignedTaskService.deleteAssignedTask(assigned_task_id);
    },
    editAssignedTask: async (
      _parent: undefined,
      {
        assignedTaskId,
        goalName,
        goalDescription,
        startDate,
        taskStatus,
        endDate,
        marillacBucksAddition,
        marillacBucksDeduction,
        comment,
      }: {
        assignedTaskId: number;
        goalName?: string;
        goalDescription?: string;
        startDate?: string;
        endDate?: string;
        taskStatus?: Status;
        marillacBucksAddition?: number;
        marillacBucksDeduction?: number;
        comment?: string;
      }
    ): Promise<boolean> => {
      return assignedTaskService.editAssignedTask(
        assignedTaskId,
        goalName,
        goalDescription,
        startDate,
        endDate,
        taskStatus,
        marillacBucksAddition,
        marillacBucksDeduction,
        comment
      );
    },
  },
};

export default assignedTaskResolver;

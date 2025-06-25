import { AssignedTask } from "@prisma/client";
import prisma from "../prisma";

const deleteTaskById = {
  Mutation: {
    deleteAssignedTask: async (
      _parent: undefined,
      { assignedTaskId }: { assignedTaskId: number },
    ): Promise<AssignedTask> => {
      try {
        const deletedAssignedTask = await prisma.assignedTask.delete({
          where: {
            assigned_task_id: assignedTaskId,
          },
        });
        return deletedAssignedTask;
      } catch (error: unknown) {
        console.log(error);
        throw error;
      }
    },
  },
};

export default deleteTaskById;

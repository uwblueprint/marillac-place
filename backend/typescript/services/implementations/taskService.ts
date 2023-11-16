import { PrismaClient } from "@prisma/client";
import ITaskService, {
  TaskDTO,
  InputTaskDTO,
  Status,
} from "../interfaces/taskService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Prisma = new PrismaClient();

const Logger = logger(__filename);

class TaskService implements ITaskService {
  async getTaskById(taskId: string): Promise<TaskDTO> {
    try {
      const task = await Prisma.task.findUnique({
        where: {
          id: Number(taskId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      if (!task) {
        throw new Error(`help`);
      }

      return task;
    } catch (error: unknown) {
      Logger.error(`Failed to get task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  //    async getTaskById(taskId: string): Promise<Prisma.taskCreateInput> {
  //     try {
  //         const task = await prisma.task.findUnique({
  //             where: {
  //                 id: Number(taskId)
  //             },
  //         });

  //         if (!task) {
  //             throw new Error(`help`);
  //         }

  //         return task;
  //     } catch (error: unknown) {
  //         throw error;
  //     }
  // }

  async getTasksByCategoryId(categoryId: string): Promise<TaskDTO[]> {
    try {
      const tasks = await Prisma.task.findMany({
        where: {
          id: Number(categoryId),
        },
      });

      if (!tasks) {
        throw new Error(`help`);
      }

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByAssigneeId(assigneeId: string): Promise<TaskDTO[]> {
    try {
      const task = await Prisma.task.findUnique({
        where: {
          id: Number(assigneeId),
        },
      });

      if (!task) {
        throw new Error(`help`);
      }

      return task;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByAssignerId(assignerId: string): Promise<TaskDTO[]> {
    try {
      const task = await Prisma.task.findUnique({
        where: {
          id: Number(assignerId),
        },
      });

      if (!task) {
        throw new Error(`help`);
      }

      return task;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createTask(task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const newTask = await Prisma.task.create({
        data: {
          title: task.title,
          status: task.status,
          description: task.description,
          credit_value: task.credit_value,
          start_date: task.start_date,
          end_date: task.end_date,
          comments: task.comments,
          recurrence_frequency: task.recurrence_frequency,
          category: {
            connect: {
              id: task.category_id,
            },
          },
          assignee: {
            connect: {
              id: task.assignee_id,
            },
          },
          assigner: {
            connect: {
              id: task.assigner_id,
            },
          },
        },
      });
      return newTask;
    } catch (error: unknown) {
      Logger.error(`Failed to create task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateTaskById(taskId: string, task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const updatedTask = await Prisma.task.update({
        where: {
          id: Number(taskId),
        },
        data: {
          title: task.title,
          status: task.status,
          description: task.description,
          credit_value: task.credit_value,
          start_date: task.start_date,
          end_date: task.end_date,
          comments: task.comments,
          recurrence_frequency: task.recurrence_frequency,
          category: {
            connect: {
              id: task.category_id,
            },
          },
          assignee: {
            connect: {
              id: task.assignee_id,
            },
          },
          assigner: {
            connect: {
              id: task.assigner_id,
            },
          },
        },
      });
      return updatedTask;
    } catch (error: unknown) {
      Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteTaskById(taskId: string): Promise<TaskDTO> {
    try {
      const task = await Prisma.task.delete({
        where: {
          id: Number(taskId),
        },
      });

      if (!task) {
        throw new Error(`help`);
      }

      return task;
    } catch (error: unknown) {
      Logger.error(`Failed to delete task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default TaskService;

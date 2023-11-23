/* eslint-disable @typescript-eslint/naming-convention */
import { task, category, resident, staff } from "@prisma/client";
import prisma from "../../prisma";
import { ITaskService, TaskDTO, InputTaskDTO } from "../interfaces/taskService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

type TaskExtended =
  | null
  | (task & {
      category?: category | null;
      assignee?: resident | null;
      assigner?: staff | null;
    });

const convertTaskRelation = (taskExtended: TaskExtended): TaskDTO => {
  if (!taskExtended) {
    throw new Error("null taskRelation passed to convertTaskRelation");
  }

  const { category, assignee, assigner } = taskExtended;

  const category_name = category == null ? undefined : category.name;
  const assignee_name =
    assignee == null
      ? undefined
      : `${assignee.firstName} ${assignee.lastName}`;
  const assigner_name =
    assigner == null
      ? undefined
      : `${assigner.firstName} ${assigner.lastName}`;

  const taskDTO: TaskDTO = {
    ...taskExtended,
    category_name,
    assignee_name,
    assigner_name,
  };

  return taskDTO;
};

class TaskService implements ITaskService {
  async getTaskById(taskId: number): Promise<TaskDTO> {
    try {
      const taskExtended: TaskExtended = await prisma.task.findUnique({
        where: {
          id: Number(taskId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const dto = convertTaskRelation(taskExtended);

      return dto;
    } catch (error: unknown) {
      Logger.error(`Failed to get task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByCategoryId(categoryId: number): Promise<TaskDTO[]> {
    try {
      const tasksResponse: TaskExtended[] = await prisma.task.findMany({
        where: {
          id: Number(categoryId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const tasks: TaskDTO[] = [];

      tasksResponse.forEach((taskExtended) => {
        const dto = convertTaskRelation(taskExtended);
        tasks.push(dto);
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByAssigneeId(assigneeId: number): Promise<TaskDTO[]> {
    try {
      const tasksResponse: TaskExtended[] = await prisma.task.findMany({
        where: {
          id: Number(assigneeId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const tasks: TaskDTO[] = [];

      tasksResponse.forEach((taskExtended) => {
        const dto = convertTaskRelation(taskExtended);
        tasks.push(dto);
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByAssignerId(assignerId: number): Promise<TaskDTO[]> {
    try {
      const tasksResponse: TaskExtended[] = await prisma.task.findMany({
        where: {
          id: Number(assignerId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const tasks: TaskDTO[] = [];

      tasksResponse.forEach((taskExtended) => {
        const dto = convertTaskRelation(taskExtended);
        tasks.push(dto);
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createTask(task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const newTask: TaskExtended = await prisma.task.create({
        data: {
          title: task.title,
          status: task.status,
          description: task.description,
          creditValue: task.creditValue,
          startDate: task.startDate,
          endDate: task.endDate,
          comments: task.comments,
          recurrenceFrequency: task.recurrenceFrequency,
          category: {
            connect: {
              id: task.categoryId,
            },
          },
          assignee: {
            connect: {
              id: task.assigneeId,
            },
          },
          assigner: {
            connect: {
              id: task.assignerId,
            },
          },
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const dto = convertTaskRelation(newTask);

      return dto;
    } catch (error: unknown) {
      Logger.error(`Failed to create task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateTaskById(taskId: number, task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const updatedTask: TaskExtended = await prisma.task.update({
        where: {
          id: Number(taskId),
        },
        data: {
          title: task.title,
          status: task.status,
          description: task.description,
          creditValue: task.creditValue,
          startDate: task.startDate,
          endDate: task.endDate,
          comments: task.comments,
          recurrenceFrequency: task.recurrenceFrequency,
          category: {
            connect: {
              id: task.categoryId,
            },
          },
          assignee: {
            connect: {
              id: task.assigneeId,
            },
          },
          assigner: {
            connect: {
              id: task.assignerId,
            },
          },
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const dto = convertTaskRelation(updatedTask);

      return dto;
    } catch (error: unknown) {
      Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteTaskById(taskId: number): Promise<TaskDTO> {
    try {
      const task = await prisma.task.delete({
        where: {
          id: Number(taskId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const dto = convertTaskRelation(task);

      return dto;
    } catch (error: unknown) {
      Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default TaskService;

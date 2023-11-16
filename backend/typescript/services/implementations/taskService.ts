/* eslint-disable @typescript-eslint/naming-convention */
import { Task, Category, Resident, Staff } from "@prisma/client";
import prisma from "../../prisma";
import { ITaskService, TaskDTO, InputTaskDTO } from "../interfaces/taskService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

type TaskExtended =
  | null
  | (Task & {
      category?: Category | null;
      assignee?: Resident | null;
      assigner?: Staff | null;
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
      : `${assignee.first_name} ${assignee.last_name}`;
  const assigner_name =
    assigner == null
      ? undefined
      : `${assigner.first_name} ${assigner.last_name}`;

  const taskDTO: TaskDTO = {
    ...taskExtended,
    category_name,
    assignee_name,
    assigner_name,
  };

  return taskDTO;
};

class TaskService implements ITaskService {
  async getTaskById(taskId: string): Promise<TaskDTO> {
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

  async getTasksByCategoryId(categoryId: string): Promise<TaskDTO[]> {
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

  async getTasksByAssigneeId(assigneeId: string): Promise<TaskDTO[]> {
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

  async getTasksByAssignerId(assignerId: string): Promise<TaskDTO[]> {
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

  async updateTaskById(taskId: string, task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const updatedTask: TaskExtended = await prisma.task.update({
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

  async deleteTaskById(taskId: string): Promise<TaskDTO> {
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

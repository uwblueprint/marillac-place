/* eslint-disable @typescript-eslint/naming-convention */
import { task, category, resident, staff } from "@prisma/client";
import prisma from "../../prisma";
import {
  ITaskService,
  TaskDTO,
  InputTaskDTO,
  Status,
} from "../interfaces/taskService";
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
  const { category: theCategory, assignee, assigner } = taskExtended;
  const category_name = theCategory == null ? "" : theCategory.name;
  const assignee_name =
    assignee == null ? "" : `${assignee.firstName} ${assignee.lastName}`;
  const assigner_name =
    assigner == null ? "" : `${assigner.firstName} ${assigner.lastName}`;

  const taskDTO: TaskDTO = {
    ...taskExtended,
    categoryName: category_name,
    assigneeName: assignee_name,
    assignerName: assigner_name,
  };

  return taskDTO;
};

class TaskService implements ITaskService {
  async getTaskById(taskId: number): Promise<TaskDTO> {
    try {
      const taskExtended: TaskExtended = await prisma.task.findUnique({
        where: {
          id: taskId,
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
      const tasksResponse = await prisma.task.findMany({
        where: { categoryId },
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
          assigneeId,
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
          assignerId,
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

  async getTasksByStartDate(startDate: Date): Promise<TaskDTO[]> {
    try {
      const tasksResponse: TaskExtended[] = await prisma.task.findMany({
        where: {
          startDate,
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

  async getTasksByEndDate(endDate: Date): Promise<TaskDTO[]> {
    try {
      const tasksResponse: TaskExtended[] = await prisma.task.findMany({
        where: {
          endDate,
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

  async getTasksByStatus(status: Status): Promise<TaskDTO[]> {
    try {
      const tasksResponse: TaskExtended[] = await prisma.task.findMany({
        where: {
          status,
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

  async createTask(inputTask: InputTaskDTO): Promise<TaskDTO> {
    try {
      const newTask: TaskExtended = await prisma.task.create({
        data: inputTask,
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

  async updateTaskById(
    taskId: number,
    updateTask: InputTaskDTO,
  ): Promise<TaskDTO> {
    try {
      const updatedTask: TaskExtended = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: updateTask,
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
      const deletedTask = await prisma.task.delete({
        where: {
          id: taskId,
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      const dto = convertTaskRelation(deletedTask);

      return dto;
    } catch (error: unknown) {
      Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }
}

export default TaskService;

import prisma, { TaskType, Status } from "../../prisma";
import ITaskService, {
  InputTaskDTO,
  TaskDTO,
  InputTaskAssignedDTO,
  TaskAssignedDTO,
} from "../interfaces/taskService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class TaskService implements ITaskService {
  async getTaskById(taskId: number): Promise<TaskDTO> {
    try {
      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          location: true,
        },
      });
      if (!task) throw new Error(`task id ${taskId} not found`);
      return task;
    } catch (error: unknown) {
      Logger.error(`Failed to get task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByType(type: TaskType): Promise<TaskDTO[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { type },
        include: {
          location: true,
        },
      });
      if (!tasks) throw new Error(`task type ${type} not found`);

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByAssigneeId(assigneeId: number): Promise<TaskAssignedDTO[]> {
    try {
      const tasks = await prisma.taskAssigned.findMany({
        where: {
          assigneeId,
        },
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByAssignerId(assignerId: number): Promise<TaskAssignedDTO[]> {
    try {
      const tasks = await prisma.taskAssigned.findMany({
        where: {
          assignerId,
        },
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByStartDate(startDate: Date): Promise<TaskAssignedDTO[]> {
    try {
      const tasks = await prisma.taskAssigned.findMany({
        where: {
          startDate,
        },
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByEndDate(endDate: Date): Promise<TaskAssignedDTO[]> {
    try {
      const tasks = await prisma.taskAssigned.findMany({
        where: {
          endDate,
        },
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByStatus(status: Status): Promise<TaskAssignedDTO[]> {
    try {
      const tasks = await prisma.taskAssigned.findMany({
        where: {
          status,
        },
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createTask(task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const newTask = await prisma.task.create({
        data: {
          title: task.title,
          type: task.type,
          description: task.description,
          creditValue: task.creditValue,
          location: {
            connect: { id: task.locationId },
          },
        },
        include: {
          location: true,
        },
      });

      return newTask;
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
      const updatedTask = await prisma.task.update({
        where: {
          id: taskId,
        },
        data: updateTask,
        include: {
          location: true,
        },
      });
      return updatedTask;
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
          location: true,
        },
      });

      return deletedTask;
    } catch (error: unknown) {
      Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async assignTask(
    taskAssigned: InputTaskAssignedDTO,
  ): Promise<TaskAssignedDTO> {
    try {
      const newTaskAssigned = await prisma.taskAssigned.create({
        data: {
          task: {
            connect: { id: taskAssigned.taskId },
          },
          assigner: {
            connect: { userId: taskAssigned.assignerId },
          },
          assignee: {
            connect: { userId: taskAssigned.assigneeId },
          },
          status: taskAssigned.status,
          startDate: taskAssigned.startDate,
          endDate: taskAssigned.endDate,
          recurrenceFrequency: taskAssigned.recurrenceFrequency,
          comments: taskAssigned.comments,
        },
      });

      return newTaskAssigned;
    } catch (error: unknown) {
      Logger.error(`Failed to assign task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async changeTaskStatus(
    taskAssignedId: number,
    status: Status,
  ): Promise<TaskAssignedDTO> {
    try {
      const updatedTask = await prisma.taskAssigned.update({
        where: {
          id: taskAssignedId,
        },
        data: {
          status,
        },
      });

      return updatedTask;
    } catch (error: unknown) {
      Logger.error(
        `Failed to update task status. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default TaskService;

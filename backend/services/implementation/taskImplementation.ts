import prisma from "../../prisma";
import { TaskType, TaskStatus } from "@prisma/client";
import ITaskService, {
  InputTaskDTO,
  TaskDTO,
  // InputTaskAssignedDTO,
  // TaskAssignedDTO,
} from "../interface/taskInterface";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class TaskService implements ITaskService {
  async getTaskById(taskId: number): Promise<TaskDTO> {
    try {
      const task = await prisma.task.findUnique({
        where: { taskId: taskId },
        // include: {
        //   location: true,
        // },
      });
      if (!task) throw new Error(`task id ${taskId} not found`);

      const taskDto: TaskDTO = {
        id: task.taskId,
        title: task.name,
        creditValue: task.credit,
        type: task.type,
        isRecurring: task.isRecurring,
        repeatDays: task.repeatDays,
        start: task.start,
        end: task.end || null,
      };

      return taskDto;
    } catch (error: unknown) {
      Logger.error(`Failed to get task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByType(type: TaskType): Promise<TaskDTO[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { type },
      });
      if (!tasks) throw new Error(`task type ${type} not found`);

      const tasksDTOs: TaskDTO[] = tasks.map((task) => ({
        id: task.taskId,
        title: task.name,
        creditValue: task.credit,
        type: task.type,
        isRecurring: task.isRecurring,
        repeatDays: task.repeatDays,
        start: task.start,
        end: task.end || null,
      }));
      return tasksDTOs;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  // async getTasksByAssigneeId(assigneeId: number): Promise<TaskAssignedDTO[]> {
  //   try {
  //     const tasks = await prisma.taskAssigned.findMany({
  //       where: {
  //         assigneeId,
  //       },
  //     });

  //     return tasks;
  //   } catch (error: unknown) {
  //     Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
  //     throw error;
  //   }
  // }

  // async getTasksByAssignerId(assignerId: number): Promise<TaskAssignedDTO[]> {
  //   try {
  //     const tasks = await prisma.taskAssigned.findMany({
  //       where: {
  //         assignerId,
  //       },
  //     });

  //     return tasks;
  //   } catch (error: unknown) {
  //     Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
  //     throw error;
  //   }
  // }

  async getTasksByStartDate(startDate: Date): Promise<TaskDTO[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          start: startDate,
        },
      });
      const tasksDTOs: TaskDTO[] = tasks.map((task) => ({
        id: task.taskId,
        title: task.name,
        creditValue: task.credit,
        type: task.type,
        isRecurring: task.isRecurring,
        repeatDays: task.repeatDays,
        start: task.start,
        end: task.end || null,
      }));
      return tasksDTOs;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  // async getTasksByEndDate(endDate: Date): Promise<TaskAssignedDTO[]> {
  //   try {
  //     const tasks = await prisma.taskAssigned.findMany({
  //       where: {
  //         endDate,
  //       },
  //     });

  //     return tasks;
  //   } catch (error: unknown) {
  //     Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
  //     throw error;
  //   }
  // }

  // async getTasksByStatus(status: TaskStatus): Promise<TaskDTO[]> {
  //   try {
  //     const tasks = await prisma.task.findMany({
  //       where: {
  //         status,
  //       },
  //     });

  //     return tasks;
  //   } catch (error: unknown) {
  //     Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
  //     throw error;
  //   }
  // }

  async createTask(task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const newTask = await prisma.task.create({
        data: {
          name: task.title,
          type: task.type,
          credit: task.creditValue,
          start: task.start,
          isRecurring: task.isRecurring,
          end: task.end,
          repeatDays: task.repeatDays,
        },
        // include: {
        //   location: true,
        // },
      });
      const taskDto: TaskDTO = {
        id: newTask.taskId,
        title: newTask.name,
        creditValue: newTask.credit,
        type: newTask.type,
        isRecurring: newTask.isRecurring,
        repeatDays: newTask.repeatDays,
        start: newTask.start,
        end: newTask.end || null,
      };
      return taskDto;
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
          taskId: taskId,
        },
        data: {
          name: updateTask.title,
          credit: updateTask.creditValue,
          type: updateTask.type,
          isRecurring: updateTask.isRecurring,
          repeatDays: updateTask.repeatDays,
          start: updateTask.start,
          end: updateTask.end || null,
        },
      });

      const taskDto: TaskDTO = {
        id: updatedTask.taskId,
        title: updatedTask.name,
        creditValue: updatedTask.credit,
        type: updatedTask.type,
        isRecurring: updatedTask.isRecurring,
        repeatDays: updatedTask.repeatDays,
        start: updatedTask.start,
        end: updatedTask.end || null,
      };
      return taskDto;
    } catch (error: unknown) {
      Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async deleteTaskById(taskId: number): Promise<TaskDTO> {
    try {
      const deletedTask = await prisma.task.delete({
        where: {
          taskId: taskId,
        },
      });

      const taskDto: TaskDTO = {
        id: deletedTask.taskId,
        title: deletedTask.name,
        creditValue: deletedTask.credit,
        type: deletedTask.type,
        isRecurring: deletedTask.isRecurring,
        repeatDays: deletedTask.repeatDays,
        start: deletedTask.start,
        end: deletedTask.end || null,
      };

      return taskDto;
    } catch (error: unknown) {
      Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  // async assignTask(
  //   taskAssigned: InputTaskAssignedDTO,
  // ): Promise<TaskAssignedDTO> {
  //   try {
  //     const newTaskAssigned = await prisma.task.create({
  //       data: {
  //         task: {
  //           connect: { id: taskAssigned.taskId },
  //         },
  //         assigner: {
  //           connect: { userId: taskAssigned.assignerId },
  //         },
  //         assignee: {
  //           connect: { userId: taskAssigned.assigneeId },
  //         },
  //         status: taskAssigned.status,
  //         startDate: taskAssigned.startDate,
  //         comments: taskAssigned.comments,
  //       },
  //     });

  //     return newTaskAssigned;
  //   } catch (error: unknown) {
  //     Logger.error(`Failed to assign task. Reason = ${getErrorMessage(error)}`);
  //     throw error;
  //   }
  // }

  // async changeTaskStatus(
  //   taskAssignedId: number,
  //   status: Status,
  // ): Promise<TaskAssignedDTO> {
  //   try {
  //     const updatedTask = await prisma.taskAssigned.update({
  //       where: {
  //         id: taskAssignedId,
  //       },
  //       data: {
  //         status,
  //       },
  //     });

  //     return updatedTask;
  //   } catch (error: unknown) {
  //     Logger.error(
  //       `Failed to update task status. Reason = ${getErrorMessage(error)}`,
  //     );
  //     throw error;
  //   }
  // }
}

export default TaskService;

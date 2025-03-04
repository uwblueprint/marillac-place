import prisma from "../../prisma";
import { DaysOfWeek, Task, TaskType } from "@prisma/client";
import ITaskService from "../interface/taskInterface";

class TaskService implements ITaskService {
  async getTaskById(taskId: number): Promise<Task> {
    try {
      const task = await prisma.task.findUnique({
        where: { taskId: taskId },
      });
      if (!task) throw new Error(`task id ${taskId} not found`);

      return task;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async getTasksByType(type: TaskType): Promise<Task[]> {
    const defaultEnd: Date = new Date("2030-01-01T08:00:00.000Z");
    try {
      const tasks = await prisma.task.findMany({
        where: { type },
      });
      if (!tasks) throw new Error(`task type ${type} not found`);

      return tasks.map((task) => ({
        ...task,
        end: task.end ?? defaultEnd,
      }));
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async getTasksByStartDate(startDate: Date): Promise<Task[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          start: startDate,
        },
      });
      return tasks;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async createTask(
    type: TaskType,
    name: string,
    credit: number,
    start: Date,
    end: Date,
    isRecurring: boolean,
    repeatDays: DaysOfWeek[],
  ): Promise<Task> {
    try {
      const newTask = await prisma.task.create({
        data: {
          type,
          name,
          credit,
          start,
          end,
          isRecurring,
          repeatDays,
        },
      });

      return newTask;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async updateTaskById(
    taskId: number,
    type: TaskType,
    name: string,
    credit: number,
    start: Date,
    end: Date,
    isRecurring: boolean,
    repeatDays: DaysOfWeek[],
  ): Promise<Task> {
    try {
      const updatedTask = await prisma.task.update({
        where: {
          taskId: taskId,
        },
        data: {
          type,
          name,
          credit,
          start,
          end,
          isRecurring,
          repeatDays,
        },
      });

      return updatedTask;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async deleteTaskById(taskId: number): Promise<Task> {
    try {
      const deletedTask = await prisma.task.delete({
        where: {
          taskId: taskId,
        },
      });
      return deletedTask;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }
}

export default TaskService;

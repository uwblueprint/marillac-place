import prisma from "../../prisma";
import {
  DaysOfWeek,
  RecurrenceFrequency,
  Task,
  TaskType,
  TimeOption,
} from "@prisma/client";
import ITaskService from "../interface/taskInterface";

class TaskService implements ITaskService {
  async getTaskById(taskId: number): Promise<Task> {
    try {
      const task = await prisma.task.findUnique({
        where: { taskId },
      });
      if (!task) throw new Error(`task id ${taskId} not found`);

      return task;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async getTasksByType(type: TaskType): Promise<Task[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { type },
      });
      if (!tasks) throw new Error(`task type ${type} not found`);

      return tasks;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  }

  async getTasksByRecurrenceFrequency(
    recurrencePreference: RecurrenceFrequency,
  ): Promise<Task[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { recurrencePreference },
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
    recurrencePreference: RecurrenceFrequency,
    repeatDays: DaysOfWeek[],
    timePreference: TimeOption,
    credit: number,
    deduction: number,
    start: string,
    end: string,
    comment: string,
  ): Promise<Task> {
    try {
      const newTask = await prisma.task.create({
        data: {
          type,
          name,
          recurrencePreference,
          repeatDays,
          timePreference,
          credit,
          deduction,
          start,
          end,
          comment,
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
    recurrencePreference: RecurrenceFrequency,
    repeatDays: DaysOfWeek[],
    timePreference: TimeOption,
    credit: number,
    deduction: number,
    start: string,
    end: string,
    comment: string,
  ): Promise<Task> {
    try {
      const updatedTask = await prisma.task.update({
        where: {
          taskId,
        },
        data: {
          type,
          name,
          recurrencePreference,
          repeatDays,
          timePreference,
          credit,
          deduction,
          start,
          end,
          comment,
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
          taskId,
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

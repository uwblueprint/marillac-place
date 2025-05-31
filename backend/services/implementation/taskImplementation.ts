import prisma from "../../prisma";
import {
  DayOfWeek,
  RecurrenceFrequency,
  Task,
  TaskType,
  TimeOption,
} from "@prisma/client";
import ITaskService from "../interface/taskInterface";

class TaskService implements ITaskService {
  // async getTaskById(taskId: number): Promise<Task> {
  //   try {
  //     const task = await prisma.task.findUnique({
  //       where: { taskId },
  //     });
  //     if (!task) throw new Error(`task id ${taskId} not found`);
  //
  //     return task;
  //   } catch (error: unknown) {
  //     console.log(error);
  //     throw error;
  //   }
  // }
  //
  async getTasksByType(type: TaskType): Promise<Task[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: { task_type: type },
      });
      return tasks;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
  //
  // async getTasksByRecurrenceFrequency(
  //   recurrencePreference: RecurrenceFrequency,
  // ): Promise<Task[]> {
  //   try {
  //     const tasks = await prisma.task.findMany({
  //       where: { recurrencePreference },
  //     });
  //     return tasks;
  //   } catch (error: unknown) {
  //     console.log(error);
  //     throw error;
  //   }
  // }

  async createTask(
    type: TaskType,
    name: string,
    recurrencePreference: RecurrenceFrequency,
    repeatDays: DayOfWeek[],
    timePreference: TimeOption,
    marillacBucks: number,
    deduction: number,
    startTime?: string,
    endTime?: string,
    comment?: string,
  ): Promise<boolean> {
    try {
      await prisma.task.create({
        data: {
          task_type: type,
          task_name: name,
          recurrence_preference: recurrencePreference,
          repeat_days: repeatDays,
          time_preference: timePreference,
          marillac_bucks_addition: marillacBucks,
          marillac_bucks_deduction: deduction,
          start_time: startTime,
          end_time: endTime,
          comment,
        },
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

  // async updateTaskById(
  //   taskId: number,
  //   type: TaskType,
  //   name: string,
  //   recurrencePreference: RecurrenceFrequency,
  //   repeatDays: DaysOfWeek[],
  //   timePreference: TimeOption,
  //   credit: number,
  //   deduction: number,
  //   start: string,
  //   end: string,
  //   comment: string,
  // ): Promise<Task> {
  //   try {
  //     const updatedTask = await prisma.task.update({
  //       where: {
  //         taskId,
  //       },
  //       data: {
  //         type,
  //         name,
  //         recurrencePreference,
  //         repeatDays,
  //         timePreference,
  //         credit,
  //         deduction,
  //         start,
  //         end,
  //         comment,
  //       },
  //     });
  //
  //     return updatedTask;
  //   } catch (error: unknown) {
  //     console.log(error);
  //     throw error;
  //   }
  // }
  //
  async deleteTaskById(taskId: number): Promise<boolean> {
    try {
      await prisma.task.delete({
        where: { task_id: taskId },
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }
}

export default TaskService;

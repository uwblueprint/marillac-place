import {
  DayOfWeek,
  RecurrenceFrequency,
  Task,
  TaskType,
  TimeOption,
} from "@prisma/client";
import prisma from "../../prisma";
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
    comment?: string
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

  async updateTask(
    id: number,
    type?: TaskType,
    name?: string,
    recurrencePreference?: RecurrenceFrequency,
    repeatDays?: DayOfWeek[],
    timePreference?: TimeOption,
    marillacBucks?: number,
    deduction?: number,
    startTime?: string,
    endTime?: string,
    comment?: string
  ): Promise<boolean> {
    const updatedData: Record<string, any> = {};
    if (type) updatedData.task_type = type;
    if (name) updatedData.task_name = name;
    if (recurrencePreference)
      updatedData.recurrence_preference = recurrencePreference;
    if (repeatDays) updatedData.repeat_days = repeatDays;
    if (timePreference) updatedData.time_preference = timePreference;
    if (marillacBucks) updatedData.marillac_bucks_addition = marillacBucks;
    if (deduction) updatedData.marillac_bucks_deduction = deduction;
    if (startTime) updatedData.start_time = startTime;
    if (endTime) updatedData.end_time = endTime;
    if (comment) updatedData.comment = comment;

    try {
      await prisma.task.update({
        where: { task_id: id },
        data: updatedData,
      });
      return true;
    } catch (err) {
      throw new Error("Something went wrong");
    }
  }

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

  async deleteAssignedTask(assigned_task_id: number): Promise<boolean> {
    try {
      await prisma.assignedTask.delete({
        where: { assigned_task_id },
      });
      return true;
    } catch (err) {
      throw new Error(`Something went wrong: ${JSON.stringify(err)}`);
    }
  }
}

export default TaskService;

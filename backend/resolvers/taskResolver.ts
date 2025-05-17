// import {
//   DaysOfWeek,
//   RecurrenceFrequency,
//   Task,
//   TaskType,
//   TimeOption,
// } from "@prisma/client";
// import TaskService from "../../services/implementation/taskImplementation";
// import ITaskService from "../../services/interface/taskInterface";
//
// const taskService: ITaskService = new TaskService();
//
// const taskResolvers = {
//   Query: {
//     getTaskById: async (
//       _parent: undefined,
//       { taskId }: { taskId: number },
//     ): Promise<Task> => {
//       const task = await taskService.getTaskById(taskId);
//       return task;
//     },
//     getTasksByType: async (
//       _parent: undefined,
//       { type }: { type: TaskType },
//     ): Promise<Array<Task>> => {
//       const tasks = await taskService.getTasksByType(type);
//       return tasks;
//     },
//     getTasksByRecurrenceFrequency: async (
//       _parent: undefined,
//       { recurrencePreference }: { recurrencePreference: RecurrenceFrequency },
//     ): Promise<Task[]> => {
//       const tasks =
//         await taskService.getTasksByRecurrenceFrequency(recurrencePreference);
//       return tasks;
//     },
//   },
//   Mutation: {
//     createTask: async (
//       _parent: undefined,
//       {
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
//       }: {
//         type: TaskType;
//         name: string;
//         recurrencePreference: RecurrenceFrequency;
//         repeatDays: DaysOfWeek[];
//         timePreference: TimeOption;
//         credit: number;
//         deduction: number;
//         start: string;
//         end: string;
//         comment: string;
//       },
//     ): Promise<Task> => {
//       const newTask = await taskService.createTask(
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
//       );
//       return newTask;
//     },
//     updateTask: async (
//       _parent: undefined,
//       {
//         taskId,
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
//       }: {
//         taskId: number;
//         type: TaskType;
//         name: string;
//         recurrencePreference: RecurrenceFrequency;
//         repeatDays: DaysOfWeek[];
//         timePreference: TimeOption;
//         credit: number;
//         deduction: number;
//         start: string;
//         end: string;
//         comment: string;
//       },
//     ): Promise<Task> => {
//       const updatedTask = await taskService.updateTaskById(
//         taskId,
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
//       );
//       return updatedTask;
//     },
//     deleteTask: async (
//       _parent: undefined,
//       { taskId }: { taskId: number },
//     ): Promise<Task> => {
//       const deletedTask = await taskService.deleteTaskById(taskId);
//       return deletedTask;
//     },
//   },
// };
//
// export default taskResolvers;

// import {
//   TaskType,
//   DaysOfWeek,
//   Task,
//   RecurrenceFrequency,
//   TimeOption,
// } from "@prisma/client";
//
// interface ITaskService {
//   getTaskById(taskId: number): Promise<Task>;
//   getTasksByType(type: TaskType): Promise<Task[]>;
//   getTasksByRecurrenceFrequency(recurrencePreference: RecurrenceFrequency): Promise<Task[]>;
//
//   createTask(
//     type: TaskType,
//     name: string,
//     recurrencePreference: RecurrenceFrequency,
//     repeatDays: DaysOfWeek[],
//     timePreference: TimeOption,
//     credit: number,
//     deduction: number,
//     start?: string,
//     end?: string,
//     comment?: string,
//   ): Promise<Task>;
//   updateTaskById(
//     taskId: number,
//     type: TaskType,
//     name: string,
//     recurrencePreference: RecurrenceFrequency,
//     repeatDays: DaysOfWeek[],
//     timePreference: TimeOption,
//     credit: number,
//     deduction: number,
//     start?: string,
//     end?: string,
//     comment?: string,
//   ): Promise<Task>;
//   deleteTaskById(taskId: number): Promise<Task>;
// }
//
// export default ITaskService;

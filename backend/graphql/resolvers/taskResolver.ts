import { DaysOfWeek, Task, TaskType } from "@prisma/client";
import TaskService from "../../services/implementation/taskImplementation";
import ITaskService from "../../services/interface/taskInterface";

const taskService: ITaskService = new TaskService();

const taskResolvers = {
  Query: {
    getTaskById: async (
      _parent: undefined,
      { taskId }: { taskId: number },
    ): Promise<Task> => {
      const task = await taskService.getTaskById(taskId);
      return task;
    },
    getTasksByType: async (
      _parent: undefined,
      { type }: { type: TaskType },
    ): Promise<Array<Task>> => {
      const tasks = await taskService.getTasksByType(type);
      return tasks;
    },
    getTasksByStartDate: async (
      _parent: undefined,
      { startDate }: { startDate: Date },
    ): Promise<Task[]> => {
      const tasks = await taskService.getTasksByStartDate(startDate);
      return tasks;
    },
  },
  Mutation: {
    createTask: async (
      _parent: undefined,
      {
        type,
        name,
        credit,
        start,
        end,
        isRecurring,
        repeatDays,
      }: {
        type: TaskType;
        name: string;
        credit: number;
        start: Date;
        end: Date;
        isRecurring: boolean;
        repeatDays: DaysOfWeek[];
      },
    ): Promise<Task> => {
      const newTask = await taskService.createTask(
        type,
        name,
        credit,
        start,
        end,
        isRecurring,
        repeatDays,
      );
      return newTask;
    },
    updateTask: async (
      _parent: undefined,
      {
        taskId,
        type,
        name,
        credit,
        start,
        end,
        isRecurring,
        repeatDays,
      }: {
        taskId: number;
        type: TaskType;
        name: string;
        credit: number;
        start: Date;
        end: Date;
        isRecurring: boolean;
        repeatDays: DaysOfWeek[];
      },
    ): Promise<Task> => {
      const updatedTask = await taskService.updateTaskById(
        taskId,
        type,
        name,
        credit,
        start,
        end,
        isRecurring,
        repeatDays,
      );
      return updatedTask;
    },
    deleteTask: async (
      _parent: undefined,
      { taskId }: { taskId: number },
    ): Promise<Task> => {
      const deletedTask = await taskService.deleteTaskById(taskId);
      return deletedTask;
    },
    // assignTask: async (
    //   _parent: undefined,
    //   { taskAssigned }: { taskAssigned: InputTaskAssignedDTO },
    // ): Promise<TaskAssignedDTO> => {
    //   const newTask = await taskService.assignTask(taskAssigned);
    //   return newTask;
    // },
    // changeTaskStatus: async (
    //   _parent: undefined,
    //   { taskAssignedId, status }: { taskAssignedId: number; status: Status },
    // ): Promise<TaskAssignedDTO> => {
    //   const updatedTask = await taskService.changeTaskStatus(
    //     taskAssignedId,
    //     status,
    //   );
    //   return updatedTask;
    // },
  },
};

export default taskResolvers;

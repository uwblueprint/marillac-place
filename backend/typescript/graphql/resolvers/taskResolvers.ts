import { Status, TaskType } from "@prisma/client";

import TaskService from "../../services/implementations/taskService";
import ITaskService, {
  TaskDTO,
  InputTaskDTO,
  InputTaskAssignedDTO,
  TaskAssignedDTO,
} from "../../services/interfaces/taskService";

const taskService: ITaskService = new TaskService();

const taskResolvers = {
  Query: {
    getTaskById: async (
      _parent: undefined,
      { taskId }: { taskId: number },
    ): Promise<TaskDTO> => {
      const task = await taskService.getTaskById(taskId);
      return task;
    },
    getTasksByType: async (
      _parent: undefined,
      { type }: { type: TaskType },
    ): Promise<Array<TaskDTO>> => {
      const tasks = await taskService.getTasksByType(type);
      return tasks;
    },
    getTasksByAssigneeId: async (
      _parent: undefined,
      { assigneeId }: { assigneeId: number },
    ): Promise<TaskAssignedDTO[]> => {
      const tasks = await taskService.getTasksByAssigneeId(assigneeId);
      return tasks;
    },
    getTasksByAssignerId: async (
      _parent: undefined,
      { assignerId }: { assignerId: number },
    ): Promise<TaskAssignedDTO[]> => {
      const tasks = await taskService.getTasksByAssignerId(assignerId);
      return tasks;
    },
    getTasksByStartDate: async (
      _parent: undefined,
      { startDate }: { startDate: Date },
    ): Promise<TaskAssignedDTO[]> => {
      const tasks = await taskService.getTasksByStartDate(startDate);
      return tasks;
    },
    getTasksByEndDate: async (
      _parent: undefined,
      { endDate }: { endDate: Date },
    ): Promise<TaskAssignedDTO[]> => {
      const tasks = await taskService.getTasksByEndDate(endDate);
      return tasks;
    },
    getTasksByStatus: async (
      _parent: undefined,
      { status }: { status: Status },
    ): Promise<TaskAssignedDTO[]> => {
      const tasks = await taskService.getTasksByStatus(status);
      return tasks;
    },
  },
  Mutation: {
    createTask: async (
      _parent: undefined,
      { task }: { task: InputTaskDTO },
    ): Promise<TaskDTO> => {
      const newTask = await taskService.createTask(task);
      return newTask;
    },
    updateTask: async (
      _parent: undefined,
      { taskId, task }: { taskId: number; task: InputTaskDTO },
    ): Promise<TaskDTO> => {
      const updatedTask = await taskService.updateTaskById(taskId, task);
      return updatedTask;
    },
    deleteTask: async (
      _parent: undefined,
      { taskId }: { taskId: number },
    ): Promise<TaskDTO> => {
      const deletedTask = await taskService.deleteTaskById(taskId);
      return deletedTask;
    },
    assignTask: async (
      _parent: undefined,
      { taskAssigned }: { taskAssigned: InputTaskAssignedDTO },
    ): Promise<TaskAssignedDTO> => {
      const newTask = await taskService.assignTask(taskAssigned);
      return newTask;
    },
    changeTaskStatus: async (
      _parent: undefined,
      { taskAssignedId, status }: { taskAssignedId: number; status: Status },
    ): Promise<TaskAssignedDTO> => {
      const updatedTask = await taskService.changeTaskStatus(
        taskAssignedId,
        status,
      );
      return updatedTask;
    },
  },
};

export default taskResolvers;

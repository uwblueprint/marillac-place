import TaskService from "../../services/implementations/taskService";
import {
  ITaskService,
  TaskDTO,
  InputTaskDTO,
} from "../../services/interfaces/taskService";

const taskService: ITaskService = new TaskService();

const taskResolvers = {
  Query: {
    getTaskById: async (
      _parent: undefined,
      { id }: { id: number },
    ): Promise<TaskDTO> => {
      const task = await taskService.getTaskById(id);
      return task;
    },
    getTasksByCategoryId: async (
      _parent: undefined,
      { categoryId }: { categoryId: number },
    ): Promise<Array<TaskDTO>> => {
      const tasks = await taskService.getTasksByCategoryId(categoryId);
      return tasks;
    },
    getTasksByAssigneeId: async (
      _parent: undefined,
      { assigneeId }: { assigneeId: number },
    ): Promise<TaskDTO[]> => {
      const tasks = await taskService.getTasksByAssigneeId(assigneeId);
      return tasks;
    },
    getTasksByAssignerId: async (
      _parent: undefined,
      { assignerId }: { assignerId: number },
    ): Promise<TaskDTO[]> => {
      const tasks = await taskService.getTasksByAssignerId(assignerId);
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
      { id, task }: { id: number; task: InputTaskDTO },
    ): Promise<TaskDTO> => {
      const updatedTask = await taskService.updateTaskById(id, task);
      return updatedTask;
    },
    deleteTask: async (
      _parent: undefined,
      { id }: { id: number },
    ): Promise<TaskDTO> => {
      const deletedTask = await taskService.deleteTaskById(id);
      return deletedTask;
    },
  },
};

export default taskResolvers;
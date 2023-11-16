import { PrismaClient } from "@prisma/client";
import ITaskService, {
  TaskDTO,
  InputTaskDTO,
  Status,
} from "../interfaces/taskService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Prisma = new PrismaClient();

const Logger = logger(__filename);

class TaskService implements ITaskService {
  async getTaskById(taskId: string): Promise<TaskDTO> {
    try {
      const taskResponse = await Prisma.task.findUnique({
        where: {
          id: Number(taskId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true
        },
      });

      if (!taskResponse || !taskResponse.category || !taskResponse.assignee || !taskResponse.assigner) {
        throw new Error(`help`);
      }

      const task: TaskDTO = {
        ...taskResponse,
        category_name: taskResponse.category.name,
        assignee_name: `${taskResponse.assignee.first_name} ${taskResponse.assignee.last_name}`,
        assigner_name: `${taskResponse.assigner.first_name} ${taskResponse.assigner.last_name}`,
      }

      return task;
    } catch (error: unknown) {
      Logger.error(`Failed to get task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByCategoryId(categoryId: string): Promise<TaskDTO[]> {
  try {
    const tasksResponse = await Prisma.task.findMany({
      where: {
        id: Number(categoryId),
      },
      include: {
        category: true,
        assignee: true,
        assigner: true
      },
    });

    const tasks: TaskDTO[] = [];

    tasksResponse.forEach((task) => {
      if (!task || !task.category || !task.assignee || !task.assigner) {
        throw new Error("Invalid task structure");
      }

      const taskDTO: TaskDTO = {
        ...task,
        category_name: task.category.name,
        assignee_name: `${task.assignee.first_name} ${task.assignee.last_name}`,
        assigner_name: `${task.assigner.first_name} ${task.assigner.last_name}`,
      };

      tasks.push(taskDTO);
    });

    return tasks;
  } catch (error: unknown) {
    Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
    throw error;
  }
}

  async getTasksByAssigneeId(assigneeId: string): Promise<TaskDTO[]> {
    try {
      const tasksResponse = await Prisma.task.findMany({
        where: {
          id: Number(assigneeId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true
        },
      });
      
      const tasks: TaskDTO[] = [];

      tasksResponse.forEach((task) => {
        if (!task || !task.category || !task.assignee || !task.assigner) {
          throw new Error("Invalid task structure");
        }

        const taskDTO: TaskDTO = {
          ...task,
          category_name: task.category.name,
          assignee_name: `${task.assignee.first_name} ${task.assignee.last_name}`,
          assigner_name: `${task.assigner.first_name} ${task.assigner.last_name}`,
        };

        tasks.push(taskDTO);
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async getTasksByAssignerId(assignerId: string): Promise<TaskDTO[]> {
    try {
      const tasksResponse = await Prisma.task.findMany({
        where: {
          id: Number(assignerId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true
        },
      });

      const tasks: TaskDTO[] = [];

      tasksResponse.forEach((task) => {
        if (!task || !task.category || !task.assignee || !task.assigner) {
          throw new Error("Invalid task structure");
        }

        const taskDTO: TaskDTO = {
          ...task,
          category_name: task.category.name,
          assignee_name: `${task.assignee.first_name} ${task.assignee.last_name}`,
          assigner_name: `${task.assigner.first_name} ${task.assigner.last_name}`,
        };

        tasks.push(taskDTO);
      });

      return tasks;
    } catch (error: unknown) {
      Logger.error(`Failed to get tasks. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async createTask(task: InputTaskDTO): Promise<TaskDTO> {
  try {
    const newTask = await Prisma.task.create({
      data: {
        title: task.title,
        status: task.status,
        description: task.description,
        credit_value: task.credit_value,
        start_date: task.start_date,
        end_date: task.end_date,
        comments: task.comments,
        recurrence_frequency: task.recurrence_frequency,
        category: {
          connect: {
            id: task.category_id,
          },
        },
        assignee: {
          connect: {
            id: task.assignee_id,
          },
        },
        assigner: {
          connect: {
            id: task.assigner_id,
          },
        },
      },
      include: {
        category: true,
        assignee: true,
        assigner: true,
      },
    });

      if (!newTask || !newTask.category || !newTask.assignee || !newTask.assigner) {
        throw new Error("Invalid task structure after creation");
      }

      const createdTask: TaskDTO = {
        ...newTask,
        category_name: newTask.category.name,
        assignee_name: `${newTask.assignee.first_name} ${newTask.assignee.last_name}`,
        assigner_name: `${newTask.assigner.first_name} ${newTask.assigner.last_name}`,
      };

      return createdTask;
    } catch (error: unknown) {
      Logger.error(`Failed to create task. Reason = ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async updateTaskById(taskId: string, task: InputTaskDTO): Promise<TaskDTO> {
    try {
      const updatedTask = await Prisma.task.update({
        where: {
          id: Number(taskId),
        },
        data: {
          title: task.title,
          status: task.status,
          description: task.description,
          credit_value: task.credit_value,
          start_date: task.start_date,
          end_date: task.end_date,
          comments: task.comments,
          recurrence_frequency: task.recurrence_frequency,
          category: {
            connect: {
              id: task.category_id,
            },
          },
          assignee: {
            connect: {
              id: task.assignee_id,
            },
          },
          assigner: {
            connect: {
              id: task.assigner_id,
            },
          },
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
      },
      });
      
      if (!updatedTask || !updatedTask.category || !updatedTask.assignee || !updatedTask.assigner) {
        throw new Error("Invalid task structure after creation");
      }

      const createdTask: TaskDTO = {
        ...updatedTask,
        category_name: updatedTask.category.name,
        assignee_name: `${updatedTask.assignee.first_name} ${updatedTask.assignee.last_name}`,
        assigner_name: `${updatedTask.assigner.first_name} ${updatedTask.assigner.last_name}`,
      };

      return createdTask;
      } catch (error: unknown) {
        Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
        throw error;
      }
    }

  async deleteTaskById(taskId: string): Promise<TaskDTO> {
    try {
      const task = await Prisma.task.delete({
        where: {
          id: Number(taskId),
        },
        include: {
          category: true,
          assignee: true,
          assigner: true,
        },
      });

      if (!task || !task.category || !task.assignee || !task.assigner) {
        throw new Error("Invalid task structure after creation");
      }
  
      const deletedTask: TaskDTO = {
        ...task,
        category_name: task.category.name,
        assignee_name: `${task.assignee.first_name} ${task.assignee.last_name}`,
        assigner_name: `${task.assigner.first_name} ${task.assigner.last_name}`,
      };
  
      return deletedTask;
      } catch (error: unknown) {
        Logger.error(`Failed to update task. Reason = ${getErrorMessage(error)}`);
        throw error;
      }
  }
}

export default TaskService;

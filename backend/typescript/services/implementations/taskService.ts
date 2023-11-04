import ITaskService from "../interfaces/taskService";
import {TaskDTO, Status} from "../interfaces/taskService";
import { PrismaClient } from '@prisma/client'

const Prisma = new PrismaClient();

class TaskService implements ITaskService {
   async getTaskById(taskId: string): Promise<TaskDTO> {
    try {
        const task = await Prisma.task.findUnique({
            where: {
                id: Number(taskId)
            },

        });

        if (!task) {
            throw new Error(`help`);
        }

        return task;
    } catch (error: unknown) {
        throw error;
    }
}

    async getTasksByCategoryId(categoryId: string): Promise<TaskDTO>{
        try {
            const tasks = await Prisma.task.findMany({
                where: {
                    id: Number(categoryId)
                }
            })
            return tasks;
        } catch (error: unknown) {
            throw error;
        }
    }
  
    async getTasksByAssigneeId(assigneeId: string): Promise<TaskDTO>{
        return {
            
        }
    }

    async getTasksByAssignerId(assignerId: string): Promise<TaskDTO>{
        return {
            
        }
    }

    async createTask(task: TaskDTO): Promise<TaskDTO>{
        return {
            
        }
    }
  
    async updateTaskById(taskId: string, task: TaskDTO): Promise<TaskDTO>{
        return {
            
        }
    }
    
    async deleteTaskById(taskId: string): Promise<TaskDTO>{
        return {
            
        }
    }
}
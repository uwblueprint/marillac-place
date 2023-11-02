import ITaskService from "../interfaces/taskService";
import {TaskDTO, Status} from "../interfaces/taskService";
import { Prisma } from "@prisma/client";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

class TaskService implements ITaskService {
    async getTaskById(id: string): Promise<Prisma.taskCreateInput>{

        // search through the task database and find the task with the matching input taskId

        const task = await prisma.task.findUnique({
            where: {
              id: Number(id),
            },
          })

        if (!task) {
            throw new Error('error')
        }

        return task
        
    }

    async getTasksByCategoryId(categoryId: string): Promise<TaskDTO>{
        return {
            
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
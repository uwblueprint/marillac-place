import ITaskService from "../interfaces/taskService";
import {TaskDTO, Status} from "../interfaces/taskService";
import prisma from '../../prisma';
import { Prisma } from "@prisma/client";

class TaskService implements ITaskService {
//    async getTaskById(taskId: string): Promise<TaskDTO> {
//     try {
//         const task = await Prisma.task.findUnique({
//             where: {
//                 id: Number(taskId)
//             },

//         });

//         if (!task) {
//             throw new Error(`help`);
//         }

//         return task;
//     } catch (error: unknown) {
//         throw error;
//     }
// }

   async getTaskById(taskId: string): Promise<Prisma.taskCreateInput> {
    try {
        const task = await prisma.task.findUnique({
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

    async getTasksByCategoryId(categoryId: string): Promise<TaskDTO []>{
        try {
            const tasks = await Prisma.task.findMany({
                where: {
                    id: Number(categoryId)
                }
            })

            if (!tasks) {
                throw new Error(`help`);
            }

            return tasks;
        } catch (error: unknown) {
            throw error;
        }
    }
  
    async getTasksByAssigneeId(assigneeId: string): Promise<TaskDTO>{
        try {
            const task = await Prisma.task.findUnique({
                where: {
                    id: Number(assigneeId)
                }
            })

            if (!task) {
                throw new Error(`help`);
            }

            return task;
        } catch (error: unknown) {
            throw error;
        }
    }

    async getTasksByAssignerId(assignerId: string): Promise<TaskDTO>{
        try {
            const task = await Prisma.task.findUnique({
                where: {
                    id: Number(assignerId)
                }
            })

            if (!task) {
                throw new Error(`help`);
            }

            return task;
        } catch (error: unknown) {
            throw error;
        }
    }

    async createTask(task: TaskDTO): Promise<TaskDTO>{
        try {
            const newTask = await Prisma.task.create({
                data: task,
            });
            return newTask;
        } catch (error: unknown) {
            throw error;
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

export default TaskService
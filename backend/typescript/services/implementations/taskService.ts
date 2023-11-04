import ITaskService from "../interfaces/taskService";
import {TaskDTO, InputTaskDTO, Status} from "../interfaces/taskService";
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

    async getTasksByCategoryId(categoryId: string): Promise<Prisma.taskCreateInput []>{
        try {
            const tasks = await prisma.task.findMany({
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
  
    async getTasksByAssigneeId(assigneeId: string): Promise<Prisma.taskCreateInput>{
        try {
            const task = await prisma.task.findUnique({
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

    async getTasksByAssignerId(assignerId: string): Promise<Prisma.taskCreateInput>{
        try {
            const task = await prisma.task.findUnique({
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

    async createTask(task: InputTaskDTO): Promise<Prisma.taskCreateInput> {
    try {
        const newTask = await prisma.task.create({
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
        });
        return newTask;
    } catch (error) {
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
export type Status = "PENDING_APPROVAL" | "INCOMPLETE" | "COMPLETE" | "EXCUSED";

export type Recurrence_Frequency = "DAILY" | "WEEKLY" | "BI_WEEKLY";

export interface InputTaskDTO {
  category_id: number;
  title: string;
  status: Status;
  description: string;
  assignee_id: number;
  assigner_id: number;
  credit_value: number;
  start_date: Date;
  end_date?: Date | null;
  comments: string;
  recurrence_frequency: Recurrence_Frequency;
}

export interface TaskDTO {
  id: number;
  category: string;
  category_id: number;
  title: string;
  status: Status;
  description: string;
  assignee_id: number;
  assignee: string;
  assigner_id: number;
  assigner: string;
  credit_value: number;
  start_date: Date;
  end_date?: Date | null;
  comments: string;
  recurrence_frequency: Recurrence_Frequency;
  // warnings: warning []
}

import {Prisma, category} from "@prisma/client"

export interface ITaskService {
  /**
   * Get the task corresponding to the taskId
   * @param id task id
   * @returns a TaskDTO associated with the task id
   * @throws Error if task retrieval fails
   */
  getTaskById(taskId: string): Promise<Prisma.taskCreateInput>;

  /**
   * Get all tasks belonging to a category
   * @param categoryId category's id
   * @returns a TaskDTO with category information
   * @throws Error if task retrieval fails
   */
  getTasksByCategoryId(categoryId: string): Promise<Prisma.taskCreateInput []>;
  
  /**
   * Get all tasks assigned to a resident
   * @param assigneeId assignee's id
   * @returns a TaskDTO with task's information
   * @throws Error if task retrieval fails
   */
  getTasksByAssigneeId(assigneeId: string): Promise<Prisma.taskCreateInput>;

  /**
   * Get all tasks assigned by a staff member
   * @param assignerId assigner's id
   * @returns a TaskDTO with task's information
   * @throws Error if task retrieval fails
   */
  getTasksByAssignerId(assignerId: string): Promise<Prisma.taskCreateInput>;

  /**
   * Create a task
   * @param task the user to be created
   * @returns a TaskDTO with the created task's information
   * @throws Error if task creation fails
   */
  createTask(task: TaskDTO): Promise<Prisma.taskCreateInput>;
  
  /**
   * Update a task.
   * @param taskId task's id
   * @param task the task to be updated
   * @returns a TaskDTO with the updated task's information
   * @throws Error if task update fails
   */
  updateTaskById(taskId: string, task: TaskDTO): Promise<Prisma.taskUpdateInput>;

  /**
   * Delete a task by id
   * @param taskId task's taskId
   * @returns a TaskDTO with the deleted task's information
   * @throws Error if task deletion fails
   */
  deleteTaskById(taskId: string): Promise<Prisma.taskCreateInput>;
}

export default ITaskService
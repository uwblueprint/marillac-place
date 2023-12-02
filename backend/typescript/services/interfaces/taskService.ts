export type Status = "PENDING_APPROVAL" | "INCOMPLETE" | "COMPLETE" | "EXCUSED";

export type RecurrenceFrequency = "DAILY" | "WEEKLY" | "BI_WEEKLY";

export interface InputTaskDTO {
  categoryId: number;
  title: string;
  status: Status;
  description: string;
  assigneeId: number;
  assignerId: number;
  creditValue: number;
  startDate: Date;
  endDate?: Date | null;
  comments: string;
  recurrenceFrequency: RecurrenceFrequency;
}

export interface TaskDTO {
  id: number;
  categoryId: number;
  categoryName: string;
  title: string;
  status: Status;
  description: string;
  assigneeId: number;
  assigneeName: string;
  assignerId: number;
  assignerName: string;
  creditValue: number;
  startDate: Date;
  endDate?: Date | null;
  comments: string;
  recurrenceFrequency: RecurrenceFrequency;
}

export interface ITaskService {
  /**
   * Get the task corresponding to the taskId
   * @param id task id
   * @returns a TaskDTO associated with the task id
   * @throws Error if task retrieval fails
   */
  getTaskById(taskId: number): Promise<TaskDTO>;

  /**
   * Get all tasks belonging to a category
   * @param categoryId category's id
   * @returns a TaskDTO with category information
   * @throws Error if task retrieval fails
   */
  getTasksByCategoryId(categoryId: number): Promise<TaskDTO[]>;

  /**
   * Get all tasks assigned to a resident
   * @param assigneeId assignee's id
   * @returns a TaskDTO with task's information
   * @throws Error if task retrieval fails
   */
  getTasksByAssigneeId(assigneeId: number): Promise<TaskDTO[]>;

  /**
   * Get all tasks assigned by a staff member
   * @param assignerId assigner's id
   * @returns a TaskDTO with task's information
   * @throws Error if task retrieval fails
   */
  getTasksByAssignerId(assignerId: number): Promise<TaskDTO[]>;

  /**
   * Create a task
   * @param task the user to be created
   * @returns a TaskDTO with the created task's information
   * @throws Error if task creation fails
   */
  createTask(task: InputTaskDTO): Promise<TaskDTO>;

  /**
   * Update a task.
   * @param taskId task's id
   * @param task the task to be updated
   * @returns a TaskDTO with the updated task's information
   * @throws Error if task update fails
   */
  updateTaskById(taskId: number, task: InputTaskDTO): Promise<TaskDTO>;

  /**
   * Delete a task by id
   * @param taskId task's taskId
   * @returns a TaskDTO with the deleted task's information
   * @throws Error if task deletion fails
   */
  deleteTaskById(taskId: number): Promise<TaskDTO>;
}

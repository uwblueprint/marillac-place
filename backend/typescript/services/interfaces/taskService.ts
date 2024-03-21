import { TaskType, Status, RecurrenceFrequency } from "../../prisma";

export interface TaskDTO {
  id: number;
  type: TaskType;
  title: string;
  description: string;
  creditValue: number;
  location: TaskLocationDTO;
}

export interface TaskLocationDTO {
  id: number;
  title: string;
  description: string;
}

export interface InputTaskDTO {
  type: TaskType;
  title: string;
  description: string;
  creditValue: number;
  locationId: number;
}

export interface InputTaskAssignedDTO {
  taskId: number;
  assigneeId: number;
  assignerId?: number;
  status: Status;
  startDate: Date;
  endDate?: Date;
  recurrenceFrequency?: RecurrenceFrequency;
  comments?: string;
}

export interface TaskAssignedDTO {
  id: number;
  taskId: number;
  assignerId: number | null;
  assigneeId: number;
  status: Status;
  startDate: Date;
  endDate: Date | null;
  recurrenceFrequency: RecurrenceFrequency | null;
  comments: string | null;
}

interface ITaskService {
  /**
   * Get the task corresponding to the taskId
   * @param id task id
   * @returns a TaskDTO associated with the task id
   * @throws Error if task retrieval fails
   */
  getTaskById(taskId: number): Promise<TaskDTO>;

  /**
   * Get all tasks belonging to a category
   * @param type task type
   * @returns a list of TaskDTOs with a given type
   * @throws Error if task retrieval fails
   */
  getTasksByType(type: TaskType): Promise<TaskDTO[]>;

  /**
   * Get all tasks assigned to a resident
   * @param assigneeId assignee's id
   * @returns a list of TaskDTOs with a given assignee
   * @throws Error if task retrieval fails
   */
  getTasksByAssigneeId(assigneeId: number): Promise<TaskAssignedDTO[]>;

  /**
   * Get all tasks assigned by a staff member
   * @param assignerId assigner's id
   * @returns a list of TaskDTOs with a given assigner
   * @throws Error if task retrieval fails
   */
  getTasksByAssignerId(assignerId: number): Promise<TaskAssignedDTO[]>;

  /**
   * Get all tasks by a start date
   * @param startDate start date
   * @returns a list of TaskDTOs starting on the provided date
   * @throws Error if task retrieval fails
   */
  getTasksByStartDate(startDate: Date): Promise<TaskAssignedDTO[]>;

  /**
   * Get all tasks by an end date
   * @param endDate end date
   * @returns a list of TaskDTOs ending on the provided date
   * @throws Error if task retrieval fails
   */
  getTasksByEndDate(endDate: Date): Promise<TaskAssignedDTO[]>;

  /**
   * Get all tasks by a status
   * @param status status
   * @returns a list of TaskDTO with a given status
   * @throws Error if task retrieval fails
   */
  getTasksByStatus(status: Status): Promise<TaskAssignedDTO[]>;

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

  /**
   * Assign a task to a resident
   * @param taskAssigned the task to be assigned
   * @returns a TaskAssignedDTO with the TaskAssigned's information
   * @throws Error if task assignment fails
   */
  assignTask(taskAssigned: InputTaskAssignedDTO): Promise<TaskAssignedDTO>;

  /**
   * Changes the status of an assigned task
   * @param taskAssigned the task to have its status changed
   * @returns a TaskAssignedDTO with the TaskAssigned's information
   * @throws Error if task status change fails
   */
  changeTaskStatus(
    taskAssignedId: number,
    status: Status,
  ): Promise<TaskAssignedDTO>;
}

export default ITaskService;

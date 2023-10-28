type Status = "Pending Approval" | "Incomplete" | "Complete" | "Excused";

type TaskDTO = {
  id: string;
  categoryId: string;
  title: string;
  status: Status;
  description: string;
  assigneeId: string;
  creditValue: string;
  startDate: string;
  endDate: string;
  comments: string;
  recurrenceFrequency: string;
  warnings: string [];
}

interface TaskService {
  /**
   * Get the task corresponding to the taskId
   * @param id task id
   * @returns a TaskDTO associated with the task id
   * @throws Error if task retrieval fails
   */
  getTaskById(id: string): Promise<TaskDTO>;

  /**
   * Get all tasks belonging to a category
   * @param categoryId category's id
   * @returns a TaskDTO with category information
   * @throws Error if task retrieval fails
   */
  getTasksByCategoryId(categoryId: string): Promise<TaskDTO>;
  
  /**
   * Get all tasks assigned to a resident
   * @param assigneeId assignee's id
   * @returns a TaskDTO with task's information
   * @throws Error if task retrieval fails
   */
  getTasksByAssigneeId(assigneeId: string): Promise<TaskDTO>;

  /**
   * Get all tasks assigned by a staff member
   * @param assignerId assigner's id
   * @returns a TaskDTO with task's information
   * @throws Error if task retrieval fails
   */
  getTasksByAssignerId(assignerId: string): Promise<TaskDTO>;

  /**
   * Create a task
   * @param task the user to be created
   * @returns a TaskDTO with the created task's information
   * @throws Error if task creation fails
   */
  createTask(task: TaskDTO): Promise<TaskDTO>;
  
  /**
   * Update a task.
   * @param taskId task's id
   * @param task the task to be updated
   * @returns a TaskDTO with the updated task's information
   * @throws Error if task update fails
   */
  updateTaskById(taskId: string, task: TaskDTO): Promise<TaskDTO>;

  /**
   * Delete a task by id
   * @param taskId task's taskId
   * @returns a TaskDTO with the deleted task's information
   * @throws Error if task deletion fails
   */
  deleteTaskById(taskId: string): Promise<TaskDTO>;
}

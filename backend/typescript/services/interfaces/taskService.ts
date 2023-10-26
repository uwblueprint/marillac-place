import {
    CreateTaskDTO,
    Role,
    SignUpMethod,
    UpdateTaskDTO,
    TaskDTO,
  } from "../../types"; // not sure lmao

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
     * @returns a UserDTO with user's information
     * @throws Error if task retrieval fails
     */
    getTasksByAssigneeId(assigneeId: string): Promise<TaskDTO>;

    /**
     * Get all tasks assigned by a staff member
     * @param assignerId assigner's id
     * @returns a TaskDTO with user's information
     * @throws Error if task retrieval fails
     */
    getTasksByAssignerId(assignerId: string): Promise<TaskDTO>;

    /**
     * Create a task
     * @param task the user to be created
     * @returns a TaskDTO with the created task's information
     * @throws Error if task creation fails
     */
    createTask(task: CreateTaskDTO): Promise<TaskDTO>;
    
    /**
     * Update a task.
     * @param taskId task's id
     * @param task the task to be updated
     * @returns a TaskDTO with the updated task's information
     * @throws Error if task update fails
     */
    updateTaskById(taskId: string, task: UpdateTaskDTO): Promise<TaskDTO>;

    /**
     * Delete a task by id
     * @param taskId task's taskId
     * @throws Error if task deletion fails
     */
    deleteTaskById(taskId: string): Promise<void>;
  }




//   Create, Edit, Complete, Delete, Get all

//   model Task {
//     id                   Int                  @id @default(autoincrement())
//     category             Category             @relation(fields: [category_id], references: [id])
//     category_id          Int
//     title                String
//     status               Statuses
//     description          String
//     assignee             Resident             @relation(fields: [assignee_id], references: [id])
//     assignee_id          Int
//     assigner             Staff                @relation(fields: [assigner_id], references: [id])
//     assigner_id          Int
//     credit_value         Float
//     start_date           DateTime
//     end_date             DateTime?
//     comments             String
//     recurrence_frequency Recurrence_Frequency
//     warnings             Warning[]
//   }

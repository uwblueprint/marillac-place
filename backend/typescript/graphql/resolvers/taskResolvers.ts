import TaskService from "../../services/implementations/taskService";
import {
  ITaskService,
  TaskDTO,
  InputTaskDTO,
} from "../../services/interfaces/taskService";

const taskService: ITaskService = new TaskService();
// const userService : IUserService = new UserService();

const taskResolvers = {
  Query: {
    getTaskById: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<TaskDTO> => {
      const task = await taskService.getTaskById(id);
      return task;
    },
    getTasksByCategoryId: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<TaskDTO[]> => {
      const tasks = await taskService.getTasksByCategoryId(id);
      return tasks;
    },
    getTasksByAssigneeId: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<TaskDTO[]> => {
      const tasks = await taskService.getTasksByAssigneeId(id);
      return tasks;
    },
    getTasksByAssignerId: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<TaskDTO[]> => {
      const tasks = await taskService.getTasksByAssignerId(id);
      return tasks;
    },
  },
  Mutation: {
    addTask: async (
      _parent: undefined,
      { task }: { task: InputTaskDTO },
    ): Promise<TaskDTO> => {
      const newTask = await taskService.createTask(task);
      return newTask;
    },
    updateTask: async (
      _parent: undefined,
      { id }: { id: string },
      { task }: { task: InputTaskDTO },
    ): Promise<TaskDTO> => {
      const updatedTask = await taskService.updateTaskById(id, task);
      return updatedTask;
    },
    deleteTask: async (
      _parent: undefined,
      { id }: { id: string },
    ): Promise<TaskDTO> => {
      const deletedTask = await taskService.deleteTaskById(id);
      return deletedTask;
    },
  },
};

// import ResidentService from "../../services/implementations/residentService";
// import type IResidentService from "../../services/interfaces/residentService";
// import type { ResidentDTO, CreateResidentDTO, UpdateResidentDTO } from "../../services/interfaces/residentService";

// const residentService: IResidentService = new ResidentService();
// //const authService: IAuthService = new AuthService(userService, emailService);

// const residentResolvers = {
//   Query: {
//     residentsById: async (
//         _parent: undefined,
//         { id }: { id: string[] },
//     ): Promise<Array<ResidentDTO>> => {
//         return residentService.get_residents_by_id(id.map(Number));
//     },
//     allResidents: async (): Promise<Array<ResidentDTO>> => {
//         return residentService.get_all_residents();
//     }
//   },
//   Mutation: {
//     addResident: async (
//         _parent: undefined,
//         { resident }: { resident: CreateResidentDTO },
//     ): Promise<ResidentDTO> => {
//         const newResident = await residentService.add_resident(resident);
//         return newResident;
//     },
//     updateResident: async (
//         _parent: undefined,
//         { id, resident }: { id: string, resident: UpdateResidentDTO },
//     ): Promise<ResidentDTO> => {
//         const newResident = await residentService.update_resident(parseInt(id), resident);
//         return newResident;
//     },
//     deleteResident: async (
//         _parent: undefined,
//         { id }: { id: string },
//     ): Promise<ResidentDTO> => {
//         const deletedResident = await residentService.delete_resident(parseInt(id));
//         return deletedResident;
//     },
//   },
// };

// export default residentResolvers;

export default taskResolvers;

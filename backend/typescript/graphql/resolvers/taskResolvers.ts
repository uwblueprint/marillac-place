import TaskService from "../../services/implementations/taskService";
import ITaskService from "../../services/interfaces/taskService";
import { TaskDTO, InputTaskDTO} from "../../services/interfaces/taskService";
import UserService from "../../services/implementations/userService";
import IUserService from "../../services/interfaces/userService";

import prisma from '../../prisma'

const taskService : ITaskService = new TaskService();
// const userService : IUserService = new UserService();

const taskResolvers = {
    Query: {
        taskById: async (
            _parent: undefined,
            { id }: { id: string }
        ): Promise<TaskDTO> => {
            return await taskService.getTaskById(id);
        },
        tasksByCategoryId: async (
            _parent: undefined,
            { id }: { id: string }
        ): Promise<TaskDTO []> => {
            return await taskService.getTasksByCategoryId(id);
        },
        tasksByAssigneeId: async (
            _parent: undefined,
            { id }: { id: string }
        ): Promise<TaskDTO []> => {
            return await taskService.getTasksByAssigneeId(id);
        },
        tasksByAssignerId: async (
            _parent: undefined,
            { id }: { id: string }
        ): Promise<TaskDTO []> => {
            return await taskService.getTasksByAssignerId(id);
        },
    },
    Mutation: {
        addTask: async (
            _parent: undefined,
            {task} : {task: InputTaskDTO},
        ): Promise <TaskDTO> => {
            return await taskService.createTask(task);
        },
        updateTask: async (
            _parent: undefined,
            {id} : {id: string},
            {task} : {task: InputTaskDTO}
        ): Promise <TaskDTO> => {
            return await taskService.updateTaskById(id, task);
        },
        deleteTask: async (
            _parent: undefined,
            { id }: { id: string }
        ): Promise<TaskDTO> => {
            return await taskService.deleteTaskById(id);
        }
    }
}

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
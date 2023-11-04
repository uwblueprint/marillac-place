import TaskService from "../../services/implementations/taskService";
import UserService from "../../services/implementations/userService";
import IUserService from "../../services/interfaces/userService";
import type {
    TaskDTO,
    ITaskService,
} from '../../services/interfaces/taskService'

const taskService : ITaskService = new TaskService();

const taskResolvers = {
    Query: {
        task: async (
            _parent: undefined,
            { id }: { id: string },
            { categoryId}: {categoryId: string},
            {}
        ): Promise<TaskDTO> => {
            return taskService.getTaskById(id);
        }
    }
}

// const skillResolvers = {
//     Query: {
//       skill: async (
//         _parent: undefined,
//         { id }: { id: string },
//       ): Promise<SkillResponseDTO> => {
//         return skillService.getSkill(id);
//       },
//       skills: async (): Promise<SkillResponseDTO[]> => {
//         return skillService.getSkills();
//       },
//     },
//     Mutation: {
//       createSkill: async (
//         _parent: undefined,
//         { skill }: { skill: SkillRequestDTO },
//       ): Promise<SkillResponseDTO> => {
//         const newSkill = await skillService.createSkill(skill);
//         return newSkill;
//       },
//       updateSkill: async (
//         _parent: undefined,
//         { id, skill }: { id: string; skill: SkillRequestDTO },
//       ): Promise<SkillResponseDTO | null> => {
//         return skillService.updateSkill(id, skill);
//       },
//       deleteSkill: async (
//         _parent: undefined,
//         { id }: { id: string },
//       ): Promise<string> => {
//         return skillService.deleteSkill(id);
//       },
//     },
//   };

export default taskResolvers;
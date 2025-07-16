import {
  AssignedTask,
} from "@prisma/client";

interface IAssignedTaskService {
  getAssignedTasks(participant_id: number): Promise<{
  MONDAY?: {
    SPECIFIC: AssignedTask[];
    ANYTIME: AssignedTask[];
  };
  TUESDAY?: {
    SPECIFIC: AssignedTask[];
    ANYTIME: AssignedTask[];
  };
  WEDNESDAY?: {
    SPECIFIC: AssignedTask[];
    ANYTIME: AssignedTask[];
  };
  THURSDAY?: {
    SPECIFIC: AssignedTask[];
    ANYTIME: AssignedTask[];
  };
  FRIDAY?: {
    SPECIFIC: AssignedTask[];
    ANYTIME: AssignedTask[];
  };
  SATURDAY?: {
    SPECIFIC: AssignedTask[];
    ANYTIME: AssignedTask[];
  };
  SUNDAY?: {
    SPECIFIC: AssignedTask[];
    ANYTIME: AssignedTask[];
  };
  ANYDAY: AssignedTask[];
}>;
}

export default IAssignedTaskService;

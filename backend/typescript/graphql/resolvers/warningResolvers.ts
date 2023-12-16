import WarningService from "../../services/implementations/warningService";
import type {
  WarningDTO,
  CreateWarningDTO,
  IWarningService,
} from "../../services/interfaces/warningService";

const warningService: IWarningService = new WarningService();

const warningResolvers = {
  Mutation: {
    addWarning: async (
      _parent: undefined,
      { warning }: { warning: CreateWarningDTO },
    ): Promise<WarningDTO> => {
      const newWarning = await warningService.addWarning(warning);
      return newWarning;
    },
    deleteWarning: async (
      _parent: undefined,
      { id }: { id: number },
    ): Promise<WarningDTO> => {
      const deletedWarning = await warningService.deleteWarning(Number(id));
      return deletedWarning;
    },
  },
};

export default warningResolvers;

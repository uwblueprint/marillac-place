import prisma from "../../prisma";
import IWarningService, {
  WarningDTO,
  CreateWarningDTO,
} from "../interfaces/warningService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class WarningService implements IWarningService {
  async addWarning(warning: CreateWarningDTO): Promise<WarningDTO> {
    try {
      const newWarning = await prisma.warning.create({
        data: { ...warning },
        include: {
          assignee: true,
          assigner: true,
          relatedTask: true,
        },
      });

      return newWarning;
    } catch (error: unknown) {
      Logger.error(
        `Failed to create warning. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async deleteWarning(id: number): Promise<WarningDTO> {
    try {
      const deletedWarning = await prisma.warning.delete({
        where: {
          id,
        },
        include: {
          assignee: true,
          assigner: true,
          relatedTask: true,
        },
      });
      return deletedWarning;
    } catch (error: unknown) {
      Logger.error(
        `Failed to delete warning #${id}. Reason = ${getErrorMessage(error)}`,
      );
      throw error;
    }
  }
}

export default WarningService;

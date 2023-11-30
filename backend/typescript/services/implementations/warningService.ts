import { PrismaClient } from "@prisma/client";
import {
    IWarningService,
    WarningDTO,
    CreateWarningDTO,
} from "../interfaces/warningService";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Prisma = new PrismaClient();
const Logger = logger(__filename);

class WarningService implements IWarningService {
    async addWarning(warning: CreateWarningDTO): Promise<WarningDTO> {
        try {
            const newWarning = await Prisma.warning.create({
                data: {
                    title: warning.title,
                    description: warning.description,
                    dateIssued: (warning.dateIssued == null || warning.dateIssued || warning.dateIssued == 0) ? undefined : warning.dateIssued,
                    resident: {
                        connect: {
                            id: Number(warning.residentId)
                        }
                    },
                    // assigner: {
                    //     connect: {
                    //         id: warning.residentId
                    //     }
                    // },
                    // relatedTask: {
                    //     connect: {
                    //         id: warning.residentId
                    //     }
                    // },
                },
                include: {
                    resident: true,
                    // assigner: true,
                    // relatedTask: true
                }
            });
            return newWarning;
        } catch (error: unknown) {
            Logger.error(
                `Failed to create warning. Reason = ${getErrorMessage(error)}`,
            );
            throw error;
        }
    }

    async deleteWarning(warningId: number): Promise<WarningDTO> {
        try {
            const deletedWarning = await Prisma.warning.delete({
                where: {
                    id: warningId
                },
                include: {
                    resident: true,
                    // assigner: true,
                    // relatedTask: true
                }
            });
            return deletedWarning;
        } catch (error: unknown) {
            Logger.error(
                `Failed to delete warning #${warningId}. Reason = ${getErrorMessage(error)}`,
            );
            throw error;
        }
    }
}

export default WarningService;

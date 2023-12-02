export interface WarningDTO {
    id: number;
    title: string;
    description: string;
    dateIssued?: Date;
    residentId?: number;
    assignerId?: number;
    relatedTaskId?: number | null;
}

export interface CreateWarningDTO {
    title: string;
    description: string;
    dateIssued?: Date;
    residentId?: number;
    assignerId?: number;
    relatedTaskId?: number | null;
}

export interface IWarningService {
    /**
     * Adds a warning
     * @param warningInfo: a CreateWarningDTO with the new warning's information
     * @returns a ResidentDTO with created resident info
     * @throws Error if resident creation fails
     */
    addWarning(warningInfo: CreateWarningDTO): Promise<WarningDTO>;
    
    /**
     * Deletes a warning by id
     * @param id: resident id of resident to be deleted
     * @returns: a ResidentDTO with deleted resident's info
     * @throws Error if resident deletion fails
     */
    deleteWarning(warningId: number): Promise<WarningDTO>;

}

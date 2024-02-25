export interface WarningDTO {
  id: number;
  title: string;
  description: string;
  dateIssued?: Date;
  assigneeId: number;
  assignerId: number | null;
  relatedTaskId?: number | null;
}

export interface CreateWarningDTO {
  title: string;
  description: string;
  dateIssued?: Date;
  assigneeId: number;
  assignerId: number | null;
  relatedTaskId?: number | null;
}

export interface IWarningService {
  /**
   * Adds a warning
   * @param warningInfo: a CreateWarningDTO with the new warning's information
   * @returns a WarningDTO with created warning info
   * @throws Error if warning creation fails
   */
  addWarning(warningInfo: CreateWarningDTO): Promise<WarningDTO>;

  /**
   * Deletes a warning by id
   * @param id: warning id of warning to be deleted
   * @returns: a WarningDTO with deleted warning's info
   * @throws Error if warning deletion fails
   */
  deleteWarning(warningId: number): Promise<WarningDTO>;
}

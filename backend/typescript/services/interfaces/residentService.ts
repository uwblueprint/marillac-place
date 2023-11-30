export interface ResidentDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  displayName: string;
  profilePictureLink?: string | null;
  birthdate?: Date | null;
  credits: number;
  dateJoined: Date;
  dateLeft?: Date | null;
}

export interface CreateResidentDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  displayName: string;
  profilePictureLink?: string | null;
  birthdate?: Date | null;
  credits: number;
  dateJoined: Date;
}

export interface UpdateResidentDTO {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  displayName: string;
  profilePictureLink?: string | null;
  birthdate?: Date | null;
  credits: number;
  dateJoined: Date;
  dateLeft?: Date | null;
}

// Have to manually map enums as ts treats enums as numbers
export enum RedeemCreditsResponse {
  SUCCESS = "SUCCESS",
  NOT_ENOUGH_CREDITS = "NOT_ENOUGH_CREDITS",
  INVALID_ID = "INVALID_ID",
}

export interface IResidentService {
  /**
   * Adds a resident
   * @param residentInfo: a CreateResidentDTO with the new resident's information
   * @returns a ResidentDTO with created resident info
   * @throws Error if resident reation fails
   */
  addResident(residentInfo: CreateResidentDTO): Promise<ResidentDTO>;

  /**
   * Update a resident's details
   * @param residentId: The ID of the resident information that needs to be updated
   * @param residentInfo: Update ResidentDTO of the resident with this information
   * @returns: a ResidentDTO with resident's updated info
   */
  updateResident(
    residentId: number,
    residentInfo: UpdateResidentDTO,
  ): Promise<ResidentDTO>;

  /**
   * Deletes a resident by id
   * @param id: resident id of resident to be deleted
   * @returns: a ResidentDTO with deleted resident's info
   * @throws Error if resident deletion fails
   */
  deleteResident(residentId: number): Promise<ResidentDTO>;

  /**
   * Gets all residents
   * @returns: array of ResidentDTO's with all residents
   * @throws Error if retrieval fails
   */
  getAllResidents(): Promise<Array<ResidentDTO>>;

  /**
   * Gets certain residents based on resident id
   * @param residentId: array of resident id's to be retrieved
   * @returns: array of ResidentDTO's with residents information
   * @throws Error if retrieval fails
   */
  getResidentsById(residentId: number[]): Promise<Array<ResidentDTO>>;

  /**
   * Gets all residents that are currently active
   * @returns: array of ResidentDTO's with all active residents
   * @throws Error if retrieval fails
   */
  getActiveResidents(): Promise<Array<ResidentDTO>>;

  /**
   * Redeems certain resident's credits based on resident id
   * @param residentId: resident id whose credits are to be redeemed
   *                    and number of credits to be redeemed
   * @returns: Enum of success or not enough credits
   * @throws Error if retrieval fails
   */
  redeemCredits(id: number, credits: number): Promise<RedeemCreditsResponse>;
}

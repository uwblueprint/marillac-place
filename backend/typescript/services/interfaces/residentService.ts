import { CreateUserDTO, UpdateUserDTO, UserTypes } from "./userService";
// import { NotificationResidentDTO } from "./adminService";

export interface ResidentDTO {
  userId: number;
  residentId: number;
  birthDate: Date;
  roomNumber: number;
  credits: number;
  dateJoined: Date;
  dateLeft?: Date | null;
  notes?: string | null;
  type: UserTypes;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  displayName: string | null;
  profilePictureURL: string | null;
  isActive: boolean;
}

export interface CreateResidentDTO {
  residentId: number;
  birthDate: Date;
  roomNumber: number;
  credits: number;
  dateJoined: Date;
  dateLeft?: Date | null;
  notes?: string | null;
}

export interface UpdateResidentDTO {
  residentId: number;
  birthDate: Date;
  roomNumber: number;
  credits: number;
  dateJoined: Date;
  dateLeft?: Date | null;
  notes?: string | null;
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
   * @param userInfo: a CreateResidentDTO with the new resident's information
   * @returns a ResidentDTO with created resident info
   * @throws Error if resident reation fails
   */
  addResident(
    userInfo: CreateUserDTO,
    resident: CreateResidentDTO,
  ): Promise<ResidentDTO>;

  /**
   * Update a resident's details
   * @param residentId: The ID of the resident information that needs to be updated
   * @param residentInfo: Update ResidentDTO of the resident with this information
   * @returns: a ResidentDTO with resident's updated info
   */
  updateResident(
    residentId: number,
    userInfo: UpdateUserDTO,
    resident: UpdateResidentDTO,
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

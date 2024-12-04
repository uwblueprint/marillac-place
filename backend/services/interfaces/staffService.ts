import { UserDTO, CreateUserDTO, UpdateUserDTO } from "./userService";

export interface StaffDTO extends Omit<UserDTO, "id" | "type"> {
  userId: number;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}

export interface CreateStaffDTO extends CreateUserDTO {
  isAdmin: boolean;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
}

export interface UpdateStaffDTO extends UpdateUserDTO {
  isAdmin?: boolean;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
}

interface IStaffService {
  /**
   * Create a staff
   * @param staff the staff to be created
   * @returns a StaffDTO with the created user's information
   * @throws Error if user creation fails
   */
  addStaff(staff: CreateStaffDTO): Promise<StaffDTO>;

  /**
   * Update a staff.
   * @param staffId staff id
   * @param staff the staff to be updated
   * @returns a StaffDTO with the updated staff's information
   * @throws Error if staff update fails
   */
  updateStaff(staffId: number, staff: UpdateStaffDTO): Promise<StaffDTO>;

  /**
   * Delete a staff by id
   * @param staffId staff's id
   * @throws Error if staff deletion fails
   */
  deleteStaff(staffId: number): Promise<StaffDTO>;

  /**
   * Get all staff information
   * @returns array of StaffDTOs
   * @throws Error if staff retrieval fails
   */
  getAllStaff(): Promise<Array<StaffDTO>>;

  /**
   * Get staff associated with id
   * @param staffIds list of staff ids
   * @returns a StaffDTO with staff's information
   * @throws Error if staff retrieval fails
   */
  getStaffByIds(staffIds: number[]): Promise<Array<StaffDTO>>;
}

export default IStaffService;

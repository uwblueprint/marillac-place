import { NotificationDTO } from "./adminService";
import { UserDTO, CreateUserDTO, UpdateUserDTO } from "./userService";
import { TaskDTO } from "./taskService";
// import { WarningDTO } from "./warningService";

export interface StaffDTO {
  userId: number;
  isAdmin: boolean; 
  // tasksAssigned: TaskDTO[]; 
  // warningsAssigned: WarningDTO[]
}

export interface IStaffService {
  
  /**
   * Create a staff
   * @param userInfo the staff to be created
   * @param isAdmin if the staff is an admin or not 
   * @returns a StaffDTO with the created user's information
   * @throws Error if user creation fails
   */
  addStaff(userInfo: CreateUserDTO, isAdmin: Boolean): Promise<StaffDTO>;

  /**
   * Update a staff.
   * @param userInfo the staff to be updated
   * @param isAdmin if the staff is an admin or not 
   * @returns a StaffDTO with the updated staff's information
   * @throws Error if staff update fails
   */
  updateStaff(userInfo: UpdateUserDTO, isAdmin: Boolean): Promise<StaffDTO>;

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
  getStaffByIds(staffId: number[]): Promise<Array<StaffDTO>>;
}

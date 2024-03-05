// import { NotificationResidentDTO, NotificationDTO } from "./adminService";
import { CreateUserDTO, UpdateUserDTO, UserTypes } from "./userService";
// import { TaskDTO } from "./taskService";
// import { WarningDTO } from "./warningService";

export interface StaffDTO {
  userId: number;
  isAdmin: boolean;
  type: UserTypes;
  email: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
  displayName: string | null;
  profilePictureURL: string | null;
  isActive: boolean;
  // tasksAssigned: TaskDTO[];
  // warningsAssigned: WarningDTO[];
  // notifications     NotificationDTO[]
  // notificationsSent NotificationResidentDTO[]
}

export interface IStaffService {
  /**
   * Create a staff
   * @param userInfo the staff to be created
   * @param isAdmin if the staff is an admin or not
   * @returns a StaffDTO with the created user's information
   * @throws Error if user creation fails
   */
  addStaff(userInfo: CreateUserDTO, isAdmin?: boolean): Promise<StaffDTO>;

  /**
   * Update a staff.
   * @param staffId staff id
   * @param userInfo the staff to be updated
   * @param isAdmin if the staff is an admin or not
   * @returns a StaffDTO with the updated staff's information
   * @throws Error if staff update fails
   */
  updateStaff(
    staffId: number,
    userInfo: UpdateUserDTO,
    isAdmin?: boolean,
  ): Promise<StaffDTO>;

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

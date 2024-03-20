import { UserDTO, CreateUserDTO, UpdateUserDTO } from "./userService";
// import { TaskDTO } from "./taskService";
// import { WarningDTO } from "./warningService";
// import { NotificationReceivedDTO, NotificationDTO } from "./adminService";

export interface StaffDTO extends Omit<UserDTO, "id" | "type"> {
  userId: number;
  isAdmin: boolean;
  // tasksAssigned: TaskDTO[];
  // warningsAssigned: WarningDTO[];
  // notificationsSent: NotificationDTO[];
  // notificationsReceived: NotificationReceivedDTO[];
}

export interface CreateStaffDTO extends CreateUserDTO {
  isAdmin: boolean;
}

export interface UpdateStaffDTO extends UpdateUserDTO {
  isAdmin?: boolean;
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

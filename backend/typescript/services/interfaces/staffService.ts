import { NotificationDTO } from "./adminService";

export interface StaffDTO {
  id: number;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  displayName: string | null;
  profilePictureLink: string | null;
  notifications?: NotificationDTO[];
}

export interface CreateStaffDTO {
  id: number;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  displayName: string | null;
  profilePictureLink: string | null;
}

export interface UpdateStaffDTO {
  id: number;
  roleId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  displayName: string | null;
  profilePictureLink: string | null;
}

export interface IStaffService {
  // addStaff(reidentInfo: CreateStaffDTO): Promise<StaffDTO>;
  // updateStaff(staffId: number, staffInfo: UpdateStaffDTO): Promise<StaffDTO>;
  // deleteStaff(residentId: number): Promise<StaffDTO>;
  // getAllStaff(): Promise<Array<StaffDTO>>;
  // getStaffById(staffId: number[]): Promise<Array<StaffDTO>>;
}

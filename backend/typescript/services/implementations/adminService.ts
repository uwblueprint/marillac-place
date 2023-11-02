import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import type {
    NotificationRequestDTO,
    NotificationResponseDTO,
    IAdminService
  } from "../interfaces/adminService";
// import type ResidentDTO from "../interfaces/FILEOFDTO";
// import type IStaffService from "../interfaces/FILEOFDTO";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";

const Logger = logger(__filename);

class AdminService implements IAdminService {
  staffId: number;
  
  constructor(staffId: number){
    this.staffId = staffId
  }

  async getNotificationById(id: number): Promise<Prisma.notificationCreateInput>{
    try {
      const notification = await prisma.notification.findUnique({
        where : {
          id
        },
      });
      if(!notification) throw new Error(`notification id ${id} not found`); 
      
      return notification
    } catch (error: unknown) {
      Logger.error(`Failed to get match. Reason = ${getErrorMessage(error)}`)
      throw error;
    }
  }

  async sendNotification(notif_obj: NotificationRequestDTO, resident_id: number): Promise<void>{

  }
    
  async sendAnnouncement(notif_obj: NotificationRequestDTO): Promise<void>{
      
  }
}
export  default AdminService
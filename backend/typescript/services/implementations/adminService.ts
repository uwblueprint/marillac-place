import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import type {
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
      
      return notification;
    } catch (error: unknown) {
      Logger.error(`Failed to get Notification. Reason = ${getErrorMessage(error)}`)
      throw error;
    }
  }

  async sendNotification(notif_message: String, resident_id: number): Promise<Prisma.notificationCreateInput>{
    // let newNotificationUserLink: Prisma.notification_userCreateInput; 
    let newNotification: Prisma.notificationCreateInput; 
    try{
      newNotification = await prisma.notification.create({
        data: {
          message: String(notif_message),
          author_id: this.staffId,
          residents: {
            create: [
              { recipient: {
                connect: {
                  id: resident_id
                }
              }}
            ],
          }
        }
      })

      // ASK WILLIAM ABOUT ADDING THINGS TO THE LIST OF RESIDENTS IN NOTIFICATION 
      // newNotificationUserLink = await prisma.notification_user.create({
      //   data: {
      //     recipient_id: resident_id,
      //     notification_id: Number(newNotification.id),
      //   }
      // })

      return newNotification;
      //add list(newNotificationUserLink) to newNotification ?
      
    }catch(error){
      Logger.error(`Failed to create Notification. Reason = ${getErrorMessage(error)}`)
      throw error;
    }
  }
    
  async getActiveResidents(): Promise<Prisma.residentUncheckedCreateInput[]>{
    try{
      const residents = await prisma.resident.findMany({
        where: {
          date_left: null //check how we are implementing date_left
        }
      })

      if(!residents) throw new Error(`No residents found.`);
      
      return residents
    } catch (error) {
      Logger.error(`Failed to get all active Residents. Readon = ${getErrorMessage(error)}`);
      throw error;
    }
  }
  
  
  async sendAnnouncement(notif_message: String): Promise<Prisma.notificationCreateInput>{
    // let newNotificationUserLink: Prisma.notification_userCreateInput; 
    let newNotification: Prisma.notificationCreateInput; 
    try{
      const activeResidents = await this.getActiveResidents()

      newNotification = await prisma.notification.create({
        data: {
          message: String(notif_message),
          author_id: this.staffId,
          residents: {
            create:  activeResidents.map(resident => ({
              recipient: {
                connect: {
                  id: resident.id
                }
              }
            }))
          }
        }
      })

      // let resident: Prisma.residentUncheckedCreateInput;
      // // create notification_user for each active resident 
      
      // for(let resident of activeResidents){
      //   newNotificationUserLink = await prisma.notification_user.create({
      //     data: {
      //       recipient_id: Number(resident.id),
      //       notification_id: Number(newNotification.id),
      //     }
      //   })
      // }

      return newNotification; 

    }catch(error){
      Logger.error(`Failed to create Notification. Reason = ${getErrorMessage(error)}`)
      throw error;
    }
  }
}
export  default AdminService
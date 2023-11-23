import { Prisma } from "@prisma/client";
import prisma from "../../prisma";
import type {
    IAdminService,
    NotificationDTO,
  } from "../interfaces/adminService";
// import type ResidentDTO from "../interfaces/FILEOFDTO";
//import type IStaffService from "../interfaces/FILEOFDTO";
import logger from "../../utilities/logger";
import { getErrorMessage } from "../../utilities/errorUtils";
import { ResidentDTO } from "../interfaces/residentService"

const Logger = logger(__filename);

class AdminService implements IAdminService {
  staffId: number;
  
  constructor(staffId: number){
    this.staffId = staffId
  }

  async getAllNotifications(): Promise<NotificationDTO[]>{
    try {
      const notifications = await prisma.notification.findMany({
        include: {residents: true}
      })
      if(!notifications) throw new Error(`No residents found.`);
      return notifications;
    } catch (error) {
      Logger.error(`Failed to get all active Residents. Readon = ${getErrorMessage(error)}`);
      throw error;
    }
  }
  
  async getNotificationById(id: number): Promise<NotificationDTO>{
    try {
      const notification = await prisma.notification.findUnique({
        where : {
          id: Number(id)
        },
        include: {
          residents: true
        }
      });
      if(!notification) throw new Error(`notification id ${id} not found`); 
      
      return notification;
    } catch (error: unknown) {
      Logger.error(`Failed to get Notification. Reason = ${getErrorMessage(error)}`)
      throw error;
    }
  }

  async sendNotification(notif_message: String, resident_id: number): Promise<NotificationDTO>{
    // let newNotificationUserLink: Prisma.notification_userCreateInput; 
    let newNotification: NotificationDTO; 
    try{
      newNotification = await prisma.notification.create({
        data: {
          message: String(notif_message),
          // author: {
          //   // connect: {id: this.staffId}
          //   connect: {id: Number(resident_id)}
          //   // create: {
          //   //   first_name: "TOM",
          //   //   last_name: "BOB",
          //   //   email: "sdiofha@gmail.com",
          //   //   credits: 1.0,
          //   //   date_joined: "2011-10-05T14:48:00.000Z",
          //   //   display_name: "Display_Name"
          //   // }
          // },
          residents: {
            connect: {
                id: Number(resident_id), 
            },
            
          }
        },
        include: {
          residents: true
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
    
  async getActiveResidents(): Promise<ResidentDTO[]>{
    try{
      const residents = await prisma.resident.findMany({
        where: {
          date_left: null //check how we are implementing date_left
        },
        include : { notifications: true }
      })

      if(!residents) throw new Error(`No residents found.`);
      
      return residents
    } catch (error) {
      Logger.error(`Failed to get all active Residents. Readon = ${getErrorMessage(error)}`);
      throw error;
    }
  }
  
  
  async sendAnnouncement(notif_message: String): Promise<NotificationDTO>{
    // let newNotificationUserLink: Prisma.notification_userCreateInput; 
    let newNotification: NotificationDTO; 
    try{
      const activeResidents = await this.getActiveResidents()

      newNotification = await prisma.notification.create({
        data: {
          message: String(notif_message),
          // author: {
          //   connect: {id: this.staffId}
          // },
          residents: {
            connect:  activeResidents.map(resident => ({
              id: resident.id
            }))
          }
        },
        include: {
          residents: true
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
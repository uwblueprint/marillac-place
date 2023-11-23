import { Prisma } from "@prisma/client";
import { ResidentDTO } from "./residentService"

export interface NotificationDTO {
    id: number;
    //author_id: number;  //STAFF NOT IMPLEMENTED AT THIS POINT
    message: string;
    created_at: Date;
    residents?: ResidentDTO[]; //might need to change when integrated 
}

export interface IAdminService {

    /**
     * Get a notification by a defined id
     * @param id notification id
     * @returns a NotificationDTO associated with the notification id
     * @throws Error if retrieval fails
     */
    getNotificationById(id: number): Promise<NotificationDTO>;

    /**
     * Post a notification to the specified resident
     * @param notif_obj notification id
     * @param resident_id resident id
     * @returns a NotificationDTO associated with the posted notification
     * @throws Error if creation fails
     */
    sendNotification(notif_message: String, resident_id: number): Promise<NotificationDTO>;
    
    /**
     * Post a notification to the specified resident
     * @returns a list of NotificationDTOs containing all notifications/ announcements 
     * @throws Error if creation fails
     */
    getAllNotifications(): Promise<NotificationDTO[]>;

    /**
     * Post the announcement notif_obj to all active residents
     * @param notif_obj notification 
     * @returns the new updated NotificationDTO
     * @throws Error if creation fails
     */
    sendAnnouncement(notif_messagej: String ): Promise<NotificationDTO>;     
}

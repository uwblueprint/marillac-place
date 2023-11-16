import { Prisma } from "@prisma/client";
import { ResidentDTO } from "./residentService"
// export interface NotificationRequestDTO {
//     message: string;
// }



export interface NotificationDTO {
    id: number;
    // author_id: number; 
    message: string;
    created_at: Date;
    residents?: ResidentDTO[]; //might need to change when integrated 
}

// export interface NotificationUserDTO {
//     notification_id: number;
//     recipient_id: number;
// }

// export interface ResidentDTO {
//     id: number;
//     first_name: string;
//     last_name: string;
//     email: string;
//     phone_number?: string | null;
//     display_name: string;
//     profile_picture_link?: string | null;
//     birthdate?: Date | null;
//     credits: number;
//     date_joined: Date;
//     date_left?:  Date | null;
// }

export interface IAdminService {

    //Move to Residents Service when its done 
    getActiveResidents(): Promise<ResidentDTO[]>;
    
    /**
     * Get a notification by a defined id
     * @param id notification id
     * @returns a notificationCreateInput associated with the notification id
     * @throws Error if retrieval fails
     */
    getNotificationById(id: number): Promise<NotificationDTO>;

    /**
     * Post a notification to the specified resident
     * @param notif_obj notification id
     * @param resident_id resident id
     * @returns a notificationCreateInput associated with the posted notification
     * @throws Error if creation fails
     */
    sendNotification(notif_message: String, resident_id: number): Promise<NotificationDTO>;
    
    getAllNotifications(): Promise<NotificationDTO[]>;
    /**
     * Post the announcement notif_obj to all active residents
     * @param notif_obj notification 
     * @returns the new updated notificationCreateInput
     * @throws Error if creation fails
     */
    sendAnnouncement(notif_messagej: String ): Promise<NotificationDTO>;     
}

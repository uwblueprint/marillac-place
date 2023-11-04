import { Prisma } from "@prisma/client";

export interface IAdminService {

    //Move to Residents Service when its done 
    getActiveResidents(): Promise<Prisma.residentUncheckedCreateInput[]>;
    
    /**
     * Get a notification by a defined id
     * @param id notification id
     * @returns a notificationCreateInput associated with the notification id
     * @throws Error if retrieval fails
     */
    getNotificationById(id: number): Promise<Prisma.notificationCreateInput>;

    /**
     * Post a notification to the specified resident
     * @param notif_obj notification id
     * @param resident_id resident id
     * @returns a notificationCreateInput associated with the posted notification
     * @throws Error if creation fails
     */
    sendNotification(notif_message: String, resident_id: number): Promise<Prisma.notificationCreateInput>;
    

    
    /**
     * Post the announcement notif_obj to all active residents
     * @param notif_obj notification 
     * @returns the new updated notificationCreateInput
     * @throws Error if creation fails
     */
    sendAnnouncement(notif_messagej: String ): Promise<Prisma.notificationCreateInput>;     
}

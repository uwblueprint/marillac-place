export interface NotificationRequestDTO {
    message: string;
    created_at: Date;
}

export interface NotificationResponseDTO {
    id: number;
    author_id: number; 
    message: string;
    created_at: Date;
    residents: ResidentDTO[]; //might need to change when integrated 
}

interface IAdminServce {
    /**
     * Get a notification by a defined id
     * @param id notification id
     * @returns a NotificationResponseDTO associated with the notification id
     * @throws Error if retrieval fails
     */
    getNotificationById(id: number): Promise<NotificationResponseDTO>;

    /**
     * Post a notification to the specified resident
     * @param notif_obj notification id
     * @param resident_id resident id
     * @returns a NotificationResponseDTO associated with the posted notification
     * @throws Error if creation fails
     */
    sendNotification(notif_obj: NotificationRequestDTO, resident_id: number): Promise<NotificationResponseDTO>;
    
    /**
     * Post the announcement notif_obj to all active residents
     * @param notif_obj notification 
     * @returns the new updated NotificationResponseDTO
     * @throws Error if creation fails
     */
    sendAnnouncement(notif_obj: NotificationRequestDTO): Promise<NotificationResponseDTO>;     
}

export default IAdminServce;
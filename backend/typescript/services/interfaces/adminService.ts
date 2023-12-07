export interface NotificationDTO {
  id: number;
  authorId: number;
  message: string;
  createdAt: Date;
  residents?: NotificationResidentDTO[]; // might need to change when integrated
}

export interface NotificationResidentDTO {
  notificationId: number;
  residentId: number;
  seen: boolean;
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
  sendNotification(
    notif_message: string,
    resident_id: number,
  ): Promise<NotificationDTO>;

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
  sendAnnouncement(notif_messagej: string): Promise<NotificationDTO>;
}

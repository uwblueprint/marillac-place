export interface NotificationDTO {
  id: number;
  authorId: number;
  message: string;
  createdAt: Date;
  residents?: NotificationResidentDTO[];
}

export interface NotificationResidentDTO {
  notificationId: number;
  residentId: number;
  seen: boolean;
  isDeleted: boolean;
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
   * @param notifMessage notification message that is to be sent
   * @param residentId resident id
   * @param staffId staff id
   * @returns a NotificationDTO associated with the posted notification
   * @throws Error if creation fails
   */
  sendNotification(
    notifMessage: string,
    residentId: number,
    staffId: number,
  ): Promise<NotificationDTO>;

  /**
   * Post a notification to the specified resident
   * @returns a list of NotificationDTOs containing all notifications/ announcements
   * @throws Error if retrieval fails
   */
  getAllNotifications(): Promise<NotificationDTO[]>;

  /**
   * Post the announcement notifMessage to all active residents
   * @param notifMessage notification message that is to be sent
   * @param staffId staff id
   * @returns the new updated NotificationDTO
   * @throws Error if creation fails
   */
  sendAnnouncement(
    notifMessage: string,
    staffId: number,
  ): Promise<NotificationDTO>;

  /**
   * set a notification with notifId id to isDeleted for resident with id residentId
   * @param notifId notification id
   * @param residentId resident id
   * @returns updated NotificationDTO with the isDeleted flag set to true for resident associated with residentId
   * @throws Error if update fails
   */
  deleteNotificationForResident(
    notificationId: number,
    residentId: number,
  ): Promise<NotificationDTO>;

  /**
   * update the seen flag of notification notifId for resident residentId
   * @param notifId notification id
   * @param residentId resident id
   * @returns updated NotificationDTO with the seen flag set to true for resident associated with residentId
   * @throws Error if update fails
   */
  updateSeenForResident(
    notificationId: number,
    residentId: number,
  ): Promise<NotificationDTO>;
}

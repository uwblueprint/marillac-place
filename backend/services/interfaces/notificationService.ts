export interface NotificationDTO {
  id: number;
  authorId: number | null;
  title: string;
  message: string;
  createdAt: Date;
  recipients: NotificationReceivedDTO[];
}

export interface UpdateNotificationDTO {
  authorId?: number;
  title?: string;
  message?: string;
  createdAt?: Date;
}

export interface NotificationReceivedDTO {
  id: number;
  notificationId: number;
  recipientId: number;
  seen: boolean;
}

interface INotificationService {
  /**
   * Get all notifications for a given user id
   * @param id user id
   * @returns a NotificationDTO[] associated with that users notifications
   * @throws Error if retrieval fails
   */
  getNotificationsByRoomIds(
    roomIds: number[],
  ): Promise<NotificationReceivedDTO[]>;

  /**
   * Get a notification by a defined id
   * @param id notification id
   * @returns a NotificationDTO associated with the notification id
   * @throws Error if retrieval fails
   */
  getNotificationById(id: number): Promise<NotificationReceivedDTO>;

  /**
   * Post a notification to a specified resident or residents
   * @param authorId user id of author of notification
   * @param title title of notification
   * @param message message of notification
   * @param roomIds room ids of recipients of notification
   * @returns a NotificationDTO associated with the posted notifications
   * @throws Error if creation fails
   */
  sendNotification(
    authorId: number,
    title: string,
    message: string,
    roomIds: number[],
  ): Promise<NotificationDTO>;

  /**
   * Delete a user notification based on a notification id and user id
   * @param userId user id for deleted notification
   * @param notificationId notification id for deleted notification
   * @returns a NotificationDTO associated with the deleted Notification
   * @throws Error if retrieval fails
   */
  deleteUserNotification(notificationId: number): Promise<NotificationDTO>;

  /**
   * Update a user notification to be seen
   * @param notificationId notification id
   * @returns a NotificationDTO associated with the now seen Notification
   * @throws Error if retrieval fails
   */
  updateSeenNotification(
    notificationId: number,
  ): Promise<NotificationReceivedDTO>;

  /**
   * Update a user notification to be seen
   * @param notificationId notification id
   * @returns a NotificationDTO associated with the updated Notification
   * @throws Error if retrieval fails
   */
  updateNotificationById(
    notificationId: number,
    notification: UpdateNotificationDTO,
  ): Promise<NotificationDTO>;

  /**
   * Post an announcement notification to all active residents
   * @param title title of announcement
   * @param message message content of announcement
   * @param userId id of annoucement sender
   * @returns the new updated NotificationDTO
   * @throws Error if creation fails
   */
  sendAnnouncement(
    title: string,
    message: string,
    userId: number,
  ): Promise<NotificationDTO>;
}

export default INotificationService;

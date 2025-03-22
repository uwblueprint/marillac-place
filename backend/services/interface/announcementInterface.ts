import { Announcement, StaffType } from "@prisma/client";

interface IAnnouncementService {
  getAllAnnouncements(): Promise<Announcement[] | null>;
  getAnnouncementByRooms (rooms: number[]): Promise<Announcement[] | null>;
  createAnnouncement(
    announcementId: number,
    from: StaffType,     
    to: number[],          
    createdAt: Date,
    message: string,
  ): Promise<boolean>;
}

export default IAnnouncementService;









// import type { ResidentDTO } from "./residentService";

// export interface NotificationDTO {
//   id: number;
//   message: string;
//   createdAt?: Date;
//   authorId: number | null;
//   groupId: number;
//   recipients?: NotificationReceivedDTO[];
// }

// export interface CreateNotificationDTO {
//   message: string;
//   createdAt?: Date;
//   authorId: number | null;
// }

// export interface UpdateNotificationDTO {
//   authorId?: number;
//   message?: string;
//   createdAt?: Date;
// }

// export interface NotificationGroupDTO {
//   id: number;
//   recipients?: ResidentDTO[];
//   notifications?: NotificationDTO[];
//   announcementGroup: boolean;
// }

// export interface NotificationReceivedDTO {
//   id: number;
//   notificationId: number;
//   notification?: NotificationDTO;
//   recipientId: number;
//   seen: boolean;
// }

// interface INotificationService {
//   /**
//    * create a new notification group
//    * @param roomIds list of room ids that correspond to resideents
//    * @returns a NotificationGroupDTO that was just created
//    * @throws Error if cration fails
//    */
//   createNotificationGroup(roomIds: number[]): Promise<NotificationGroupDTO>;

//   /**
//    * Create a new notification group
//    * @returns a NotificationGroupDTO that was deleted
//    * @throws Error if creation fails
//    */
//   createAnnouncementGroup(): Promise<NotificationGroupDTO>;

//   /**
//    * send a notification to a group
//    * @param groupId notification group to send to
//    * @param notification information related to the notification to be created
//    * @returns a NotificationDTO that was just created
//    * @throws Error if creation fails
//    */
//   sendNotificationToGroup(
//     groupId: number,
//     notification: CreateNotificationDTO,
//   ): Promise<NotificationDTO>;

//   /**
//    * Delete a notification group
//    * @param groupId notification group to delete
//    * @returns a NotificationGroupDTO that was deleted
//    * @throws Error if deletion fails
//    */
//   deleteNotificationGroup(groupId: number): Promise<NotificationGroupDTO>;

//   /**
//    * Get all groups and their associated notifications
//    * @returns a list of NotificationGroupDTOs with their notifications
//    * @throws Error if retrieval fails
//    */
//   getAllGroupsAndNotifications(): Promise<NotificationGroupDTO[]>;

//   /**
//    * Get all notifications for given notification id
//    * @param id notification id
//    * @returns a NotificationDTO[] associated with that users notifications
//    * @throws Error if retrieval fails
//    */
//   getNotificationsByIds(
//     notificationIds: number[],
//   ): Promise<NotificationReceivedDTO[]>;

//   /**
//    * Updates notification for a given notification id
//    * @param id notification id
//    * @returns a NotificationDTO associated with the updated Notification
//    * @throws Error if retrieval fails
//    */
//   updateNotificationById(
//     notificationId: number,
//     notification: UpdateNotificationDTO,
//   ): Promise<NotificationDTO>;

//   /**
//    * Deletes notifications for given notification ids
//    * @param id notification id
//    * @returns a NotificationDTO associated with the updated Notification
//    * @throws Error if retrieval fails
//    */
//   deleteNotificationByIds(notficationId: number[]): Promise<boolean>;

//   /**
//    * Update a user notification to be seen
//    * @param notificationId notification id
//    * @returns a NotificationDTO associated with the now seen Notification
//    * @throws Error if retrieval fails
//    */
//   updateSeenNotification(
//     notificationSeenId: number,
//   ): Promise<NotificationReceivedDTO>;

//   /**
//    * Gets the notifications associated with a resident
//    * @param residentId resident id
//    * @returns a list of NotificationDTOs that the resident has
//    * @throws Error if retrieval fails
//    */
//   getNotificationByResident(
//     residentId: number,
//   ): Promise<NotificationReceivedDTO[]>;

//   /**
//    * Get all notifications for a given user id
//    * @param id user id
//    * @returns a NotificationDTO[] associated with that users notifications
//    * @throws Error if retrieval fails
//    */
//   // getNotificationsByRoomIds(
//   //   roomIds: number[],
//   // ): Promise<NotificationReceivedDTO[]>;

//   /**
//    * Post a notification to a specified resident or residents
//    * @param authorId user id of author of notification
//    * @param title title of notification
//    * @param message message of notification
//    * @param roomIds room ids of recipients of notification
//    * @returns a NotificationDTO associated with the posted notifications
//    * @throws Error if creation fails
//    */
//   // sendNotification(
//   //   authorId: number,
//   //   title: string,
//   //   message: string,
//   //   roomIds: number[],
//   // ): Promise<NotificationDTO>;

//   /**
//    * Delete a user notification based on a notification id and user id
//    * @param userId user id for deleted notification
//    * @param notificationId notification id for deleted notification
//    * @returns a NotificationDTO associated with the deleted Notification
//    * @throws Error if retrieval fails
//    */
//   // deleteUserNotification(notificationId: number): Promise<NotificationDTO>;

//   /**
//    * Update a user notification to be seen
//    * @param notificationId notification id
//    * @returns a NotificationDTO associated with the now seen Notification
//    * @throws Error if retrieval fails
//    */
//   // updateSeenNotification(
//   //   notificationId: number,
//   // ): Promise<NotificationReceivedDTO>;

//   /**
//    * Update a user notification to be seen
//    * @param notificationId notification id
//    * @returns a NotificationDTO associated with the updated Notification
//    * @throws Error if retrieval fails
//    */
//   // updateNotificationById(
//   //   notificationId: number,
//   //   notification: UpdateNotificationDTO,
//   // ): Promise<NotificationDTO>;

//   /**
//    * Post an announcement notification to all active residents
//    * @param title title of announcement
//    * @param message message content of announcement
//    * @param userId id of annoucement sender
//    * @returns the new updated NotificationDTO
//    * @throws Error if creation fails
//    */
//   // sendAnnouncement(
//   //   title: string,
//   //   message: string,
//   //   userId: number,
//   // ): Promise<NotificationDTO>;
// }

// export default INotificationService;

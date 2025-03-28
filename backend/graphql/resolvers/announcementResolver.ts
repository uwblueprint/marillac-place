// import NotificationService from "../../services/implementations/notificationService";
// import INotificationService, {
//   NotificationDTO,
//   NotificationGroupDTO,
//   NotificationReceivedDTO,
//   UpdateNotificationDTO,
//   CreateNotificationDTO,
// } from "../../services/interfaces/notificationService";
// import IResidentService from "../../services/interfaces/residentService";
// import ResidentService from "../../services/implementations/residentService";

// const residentService: IResidentService = new ResidentService();
// const notificationService: INotificationService = new NotificationService(
//   residentService,
// );

const resolvers = {
Query: {
    // Resolver for getAllAnnouncements
    getAllAnnouncements: async (_parent, _args, context) => {
    try {
        // Fetch all announcements from the database
        const announcements = await context.db.Announcement.findMany();
        return announcements;
    } catch (error) {
        console.error("Error fetching all announcements:", error);
        throw new Error("Failed to fetch announcements");
    }
    },

    // Resolver for getAnnouncementByRooms
    getAnnouncementByRooms: async (_parent, args, context) => {
    const { rooms } = args;
    try {
        // Fetch announcements filtered by room numbers
        const announcements = await context.db.Announcement.findMany({
        where: {
            roomNumber: {
            in: rooms, // Filter by room numbers
            },
        },
        });
        return announcements;
    } catch (error) {
        console.error("Error fetching announcements by rooms:", error);
        throw new Error("Failed to fetch announcements by rooms");
    }
    },
},
};
  
export default resolvers;

// const notificationResolvers = {
//   Query: {
//     getNotificationsByIds: async (
//       _parent: undefined,
//       { notificationIds }: { notificationIds: string[] },
//     ): Promise<NotificationReceivedDTO[]> => {
//       const notificationReceived = await notificationService.getNotificationsByIds(
//         notificationIds.map(Number),
//       );
//       return notificationReceived;
//     },
//     getNotificationByResident: async (
//       _parent: undefined,
//       { residentId }: { residentId: string },
//     ): Promise<NotificationReceivedDTO[]> => {
//       const notificationReceived = await notificationService.getNotificationByResident(
//         Number(residentId),
//       );
//       return notificationReceived;
//     },
//     getAllGroupsAndNotifications: async (): Promise<NotificationGroupDTO[]> => {
//       const notificationGroups = await notificationService.getAllGroupsAndNotifications();
//       return notificationGroups;
//     },
//   },
//   Mutation: {
//     createNotificationGroup: async (
//       _parent: undefined,
//       {
//         roomIds,
//       }: {
//         roomIds: number[];
//       },
//     ): Promise<NotificationGroupDTO> => {
//       const ids = roomIds.map((id) => Number(id));
//       const newNotificationGroup = await notificationService.createNotificationGroup(
//         ids,
//       );
//       return newNotificationGroup;
//     },
//     createAnnouncementGroup: async (): Promise<NotificationGroupDTO> => {
//       const newNotificationGroup = await notificationService.createAnnouncementGroup();
//       return newNotificationGroup;
//     },
//     sendNotificationToGroup: async (
//       _parent: undefined,
//       {
//         groupId,
//         notification,
//       }: {
//         groupId: number;
//         notification: CreateNotificationDTO;
//       },
//     ): Promise<NotificationDTO> => {
//       const newNotification = await notificationService.sendNotificationToGroup(
//         Number(groupId),
//         notification,
//       );
//       return newNotification;
//     },
//     deleteNotificationGroup: async (
//       _parent: undefined,
//       {
//         groupId,
//       }: {
//         groupId: number;
//       },
//     ): Promise<NotificationGroupDTO> => {
//       const deletedGroup = await notificationService.deleteNotificationGroup(
//         Number(groupId),
//       );
//       return deletedGroup;
//     },
//     updateNotificationById: async (
//       _parent: undefined,
//       {
//         notificationId,
//         notification,
//       }: {
//         notificationId: number;
//         notification: UpdateNotificationDTO;
//       },
//     ): Promise<NotificationDTO> => {
//       const updatedNotification = await notificationService.updateNotificationById(
//         Number(notificationId),
//         notification,
//       );
//       return updatedNotification;
//     },
//     deleteNotificationByIds: async (
//       _parent: undefined,
//       {
//         notificationIds,
//       }: {
//         notificationIds: number[];
//       },
//     ): Promise<boolean> => {
//       const ids = notificationIds.map((id) => Number(id));
//       await notificationService.deleteNotificationByIds(ids);
//       return true;
//     },
//     updateSeenNotification: async (
//       _parent: undefined,
//       {
//         notificationSeenId,
//       }: {
//         notificationSeenId: number;
//       },
//     ): Promise<NotificationReceivedDTO> => {
//       const updatedNotificationReceived = await notificationService.updateSeenNotification(
//         Number(notificationSeenId),
//       );
//       return updatedNotificationReceived;
//     },
//   },
// };

// export default notificationResolvers;

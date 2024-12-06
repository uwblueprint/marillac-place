export type NotificationResponse = {
  id: string;
  message: string;
  createdAt?: Date;
  authorId?: string;
  recipients?: NotificationReceivedResponse[];
};

export type NotificationCreateRequest = {
  message: string;
  createdAt?: Date;
  authorId?: string;
};

export type NotificationUpdateRequest = {
  message?: string;
  createdAt?: Date;
  authorId?: string;
};

export type NotificationGroupResponse = {
  id: string;
  // recipients?: Residentesponse[]; TODO: add when resident response exists
  notifications?: NotificationResponse[];
  announcementGroup: boolean;
};

export type NotificationReceivedResponse = {
  id: string;
  notificationId: string;
  notification?: NotificationResponse;
  recipientId: number;
  seen: boolean;
};

export type NotificationResponse = {
  id: string;
  authorId?: string;
  title: string;
  message: string;
  createdAt: Date;
  recipients?: [NotificationReceived];
};

export type NotificationReceived = {
  id: string;
  notificationId: string;
  recipientId: number;
  seen: boolean;
};

import React, { useEffect, useState } from "react";
import { Flex, Button } from "@chakra-ui/react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GroupAnnouncements,
  Announcement,
} from "../../../types/NotificationTypes";
import AnnouncementsGroups from "./AnnouncementsGroups";
import AnnouncementsView from "./AnnouncementsView";
import { announcementsMockData } from "../../../mocks/notifications";

import {
  SEND_NOTIFICATION,
  DELETE_USER_NOTIFICATION,
  UPDATE_SEEN_NOTIFICATION,
  SEND_ANNOUNCEMENT,
} from "../../../APIClients/Mutations/NotificationMutations";

import {
  GET_NOTIFCATION_BY_ID, 
  GET_NOTIFICATIONS_BY_USER_ID,
} from "../../../APIClients/Queries/NotificationQueries";

import {
  NotificationResponse,
  NotificationReceived,
} from "../../../APIClients/Types/NotificationType";

const AnnouncementsPage = (): React.ReactElement => {
  const [announcements, setAnnouncements] = useState<GroupAnnouncements>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [addingNewRoom, setAddingNewRoom] = useState<boolean>(false);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  // const [sendNotification] = useMutation<{
  //   authorId: string;
  //   title: string;
  //   message: string;
  //   recipientIds: [number];
  // }>(SEND_NOTIFICATION);

  // const [deleteUserNotification] = useMutation<{
  //   notificationId: string;
  // }>(DELETE_USER_NOTIFICATION);

  // const [updateSeenNotification] = useMutation<{
  //   notificationId: string;
  // }>(UPDATE_SEEN_NOTIFICATION);

  // const [sendAnnouncement] = useMutation<{
  //   title: string;
  //   message: string;
  //   userId: number;
  // }>(SEND_ANNOUNCEMENT);

  // const {
  //   loading: notificationsByUserIdLoading,
  //   error: notificationsByUserIdError,
  //   data: notificationsByUserIdData,
  // } = useQuery<{ userId: string }>(GET_NOTIFICATIONS_BY_USER_ID, {
  //   variables: { userId: "4" },
  // });

  // const {
  //   loading: notificationByIdLoading,
  //   error: notificationByIdError,
  //   data: notificationByIdData,
  // } = useQuery<{ id: string }>(GET_NOTIFCATION_BY_ID, {
  //   variables: { id: "8" },
  // });

  // const handleSendNotification = async () => {
  //   try {
  //     const authorId = "6";
  //     const title = "TITLE NOTIF";
  //     const message = "message";
  //     const recipientIds = [4];
  //     await sendNotification({
  //       variables: { authorId, title, message, recipientIds },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleSendAnnouncement = async () => {
  //   console.log(notificationsByUserIdData);
  //   console.log(notificationByIdData);
  //   try {
  //     const title = "TITLE NOTIF";
  //     const message = "message";
  //     const userId = 4;
  //     await sendAnnouncement({
  //       variables: { title, message, userId },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleDeleteNotification = async () => {
  //   try {
  //     const notificationId = "4";
  //     await deleteUserNotification({
  //       variables: { notificationId },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const handleUpdateSeenNotification = async () => {
  //   try {
  //     const notificationId = "4";
  //     await updateSeenNotification({
  //       variables: { notificationId },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    // TODO: Fetch announcements from API
    const combinedAnnouncements: GroupAnnouncements = {};
    Object.entries(announcementsMockData).forEach(([key, value]) => {
      for (let i = 0; i < value.length; i += 1) {
        const newAnnouncement: Announcement = {
          room: key,
          author: value[i].author,
          message: value[i].message,
          createdAt: value[i].createdAt,
        };
        // check if alr exists, if not create new
        if (!combinedAnnouncements[key]) {
          combinedAnnouncements[key] = [];
        }
        combinedAnnouncements[key].push(newAnnouncement);
      }
    });

    setAnnouncements(combinedAnnouncements);
  }, []);

  return (
    <Flex flexDir="column" flexGrow={1}>
      <Flex flexDir="row" alignItems="flex-start" w="100%" flexGrow={1}>
        <AnnouncementsGroups
          announcements={announcements}
          setSelectedGroup={setSelectedGroup}
          addingNewRoom={addingNewRoom}
          setAddingNewRoom={setAddingNewRoom}
          selectedRooms={selectedRooms}
        />
        <AnnouncementsView
          announcements={announcements}
          selectedGroup={selectedGroup}
          addingNewRoom={addingNewRoom}
          setAddingNewRoom={setAddingNewRoom}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
        />
      </Flex>
    </Flex>
  );
};

export default AnnouncementsPage;

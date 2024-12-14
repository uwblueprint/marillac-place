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
  CREATE_NOTIFICATION_GROUP,
  CREATE_ANNOUNCEMENT_GROUP,
  SEND_NOTIFICATION_TO_GROUP,
  DELETE_NOTIFICATION_GROUP,
  UPDATE_NOTIFICATION_BY_ID,
  DELETE_NOTIFICATION_BY_IDS,
  UPDATE_SEEN_NOTIFICATION,
} from "../../../APIClients/Mutations/NotificationMutations";

import {
  GET_NOTIFICATIONS_BY_IDS,
  GET_NOTIFCATION_BY_RESIDENT,
  GET_ALL_GROUPS_AND_NOTIFICATIONS,
} from "../../../APIClients/Queries/NotificationQueries";

import {
  NotificationResponse,
  NotificationUpdateRequest,
  NotificationCreateRequest,
  NotificationGroupResponse,
  NotificationReceivedResponse,
} from "../../../APIClients/Types/NotificationType";

const AnnouncementsPage = (): React.ReactElement => {
  const [announcements, setAnnouncements] = useState<
    NotificationGroupResponse[]
  >([]);
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

  /*
[
    {
        "__typename": "NotificationGroupDTO",
        "id": "1",
        "announcementGroup": true,
        "notifications": [],
        "recipients": null
    },
    {
        "__typename": "NotificationGroupDTO",
        "id": "34",
        "announcementGroup": false,
        "notifications": [],
        "recipients": null
    }
]
  */

  const {
    loading: allNotificationsLoading,
    error: allNotificationsError,
    data: allNotificationsData,
  } = useQuery(GET_ALL_GROUPS_AND_NOTIFICATIONS);

  const [sendNotificationToGroup] = useMutation(SEND_NOTIFICATION_TO_GROUP);
  const [createNotificationGroup] = useMutation(CREATE_NOTIFICATION_GROUP);
  const [createAnnouncementGroup] = useMutation(CREATE_ANNOUNCEMENT_GROUP);

  const sendNotification = async (
    message: string,
    groupId: string,
    newGroup?: NotificationGroupResponse,
  ) => {
    try {
      const newNotification: NotificationResponse = (
        await sendNotificationToGroup({
          variables: {
            groupId,
            notification: {
              message,
              // TODO: add author id
            },
          },
        })
      ).data.sendNotificationToGroup;

      if (!newGroup) {
        setAnnouncements((currentAnnouncements) =>
          currentAnnouncements.map((group) => {
            if (group.id === groupId) {
              return {
                ...group,
                notifications: group.notifications
                  ? [...group.notifications, newNotification]
                  : [newNotification],
              };
            }
            return group;
          }),
        );
      } else {
        setAnnouncements((currentAnnouncements) => [
          ...currentAnnouncements,
          {
            ...newGroup,
            notifications: newGroup.notifications
              ? [...newGroup.notifications, newNotification]
              : [newNotification],
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createNotificationGroupAndSendNotification = async (
    selectedIds: number[],
    message: string,
  ) => {
    try {
      if (selectedIds.length > 1) {
        throw Object.assign(new Error("Only include one room id."), {
          code: 400,
        });
      } else if (selectedIds.length === 0) {
        throw Object.assign(new Error("No rooms selected."), { code: 400 });
      }

      let newGroup;
      if (selectedIds[0] === -1) {
        newGroup = (await createAnnouncementGroup({})).data
          .createNotificationGroup;
      } else {
        newGroup = (
          await createNotificationGroup({
            variables: {
              roomIds: selectedIds,
            },
          })
        ).data.createNotificationGroup;
      }

      await sendNotification(message, newGroup.id, newGroup);
    } catch (e: any) {
      if (e.message === "Announcement Group already exists.") {
        const announcementId = announcements.find(
          (group) => group.announcementGroup === true,
        )?.id;

        if (announcementId) {
          await sendNotification(message, announcementId);
          setSelectedGroup(announcementId);
        }
      } else if (
        e.message ===
        "Notification Group already exists with specified roomIds."
      ) {
        const groupId = announcements.find((group) => {
          if (
            group.recipients &&
            group.recipients.length === selectedIds.length
          ) {
            for (let i = 0; i < group.recipients.length; i += 1) {
              if (!selectedIds.includes(group.recipients[i].roomNumber)) {
                return false;
              }
            }
            return true;
          }
          return false;
        })?.id;

        if (groupId) {
          await sendNotification(message, groupId);
          setSelectedGroup(groupId);
        }
      } else {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    // TODO: Fetch announcements from API
    if (allNotificationsData) {
      setAnnouncements(allNotificationsData.getAllGroupsAndNotifications);
    }

    // const combinedAnnouncements: GroupAnnouncements = {};
    // Object.entries(announcementsMockData).forEach(([key, value]) => {
    //   for (let i = 0; i < value.length; i += 1) {
    //     const newAnnouncement: Announcement = {
    //       room: key,
    //       author: value[i].author,
    //       message: value[i].message,
    //       createdAt: value[i].createdAt,
    //     };
    //     // check if alr exists, if not create new
    //     if (!combinedAnnouncements[key]) {
    //       combinedAnnouncements[key] = [];
    //     }
    //     combinedAnnouncements[key].push(newAnnouncement);
    //   }
    // });

    // setAnnouncements(combinedAnnouncements);
  }, [allNotificationsData]);

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
          sendNotification={sendNotification}
          createNotificationGroupAndSendNotification={
            createNotificationGroupAndSendNotification
          }
        />
      </Flex>
    </Flex>
  );
};

export default AnnouncementsPage;

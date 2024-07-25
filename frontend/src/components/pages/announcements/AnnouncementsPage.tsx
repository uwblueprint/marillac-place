import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";

import { GroupAnnouncements, Announcement } from "../../../types/NotificationTypes";
import AnnouncementsGroups from "./AnnouncementsGroups";
import AnnouncementsView from "./AnnouncementsView";
import { announcementsMockData } from "../../../mocks/notifications";

const AnnouncementsPage = (): React.ReactElement => {
  const [announcements, setAnnouncements] = useState<GroupAnnouncements>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    // TODO: Fetch announcements from API
    const combinedGroupAnnouncements: GroupAnnouncements{key: string, value: Announcement[]} = {};
    for (const room in announcementsMockData) {
      const roomKey = room as keyof typeof announcementsMockData;
      const tempGroupAnnouncements: Announcement[] = [];
      for (const announcement of announcementsMockData[roomKey]) {
        const newAnnouncement: Announcement = {
          room: room,
          author: announcement.author,
          message: announcement.message,
          createdAt: announcement.createdAt
        };
        tempGroupAnnouncements.push(newAnnouncement);
      }
      combinedGroupAnnouncement[room] = tempGroupAnnouncements;
    }
    setAnnouncements(combinedGroupAnnouncements);
  }, []);

  return (
    <Flex flexDir="column" flexGrow={1}>
      <Flex flexDir="row" alignItems="flex-start" w="100%" flexGrow={1}>
        <AnnouncementsGroups
          announcements={announcements}
          setSelectedGroup={setSelectedGroup}
        />
        <AnnouncementsView
          announcements={announcements}
          selectedGroup={selectedGroup}
        />
      </Flex>
    </Flex>
  );
};

export default AnnouncementsPage;

import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";

import {
  GroupAnnouncements,
  Announcement,
} from "../../../types/NotificationTypes";
import AnnouncementsGroups from "./AnnouncementsGroups";
import AnnouncementsView from "./AnnouncementsView";
import { announcementsMockData } from "../../../mocks/notifications";

const AnnouncementsPage = (): React.ReactElement => {
  const [announcements, setAnnouncements] = useState<GroupAnnouncements>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    // TODO: Fetch announcements from API
    setAnnouncements(announcementsMockData);
  }, []);

  const deleteAnnouncement = (room: string, id: number): void => {
    const newAnnouncements = { ...announcements };
    newAnnouncements[room] = newAnnouncements[room].filter(
      (announcement: Announcement) => announcement.id !== id,
    );
    setAnnouncements(newAnnouncements);
  };

  const updateAnnouncement = (
    room: string,
    id: number,
    message: string,
  ): void => {
    const newAnnouncements = { ...announcements };
    newAnnouncements[room] = newAnnouncements[room].map((announcement) =>
      announcement.id === id ? { ...announcement, message } : announcement,
    );
    setAnnouncements(newAnnouncements);
  };

  return (
    <Flex flexDir="row" alignItems="flex-start" w="100%">
      <AnnouncementsGroups
        announcements={announcements}
        setSelectedGroup={setSelectedGroup}
      />
      <AnnouncementsView
        announcements={announcements}
        selectedGroup={selectedGroup}
        deleteAnnouncement={deleteAnnouncement}
        updateAnnouncement={updateAnnouncement}
      />
    </Flex>
  );
};

export default AnnouncementsPage;

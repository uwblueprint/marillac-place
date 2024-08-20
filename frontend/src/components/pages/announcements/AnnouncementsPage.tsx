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

import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";

import { GroupAnnouncements } from "../../../types/NotificationTypes";
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

import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";

import { GroupAnnouncements } from "../../../types/NotificationTypes";
import AnnouncementsGroups from "./AnnouncementsGroups";
import AnnouncementsView from "./AnnouncementsView";
import { announcementsMockData } from "../../../mocks/notifications";

const AnnouncementsPage = (): React.ReactElement => {
  const [announcements, setAnnouncements] = useState<GroupAnnouncements>({});
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [addingNewRoom, setAddingNewRoom] = useState<boolean>(false);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  useEffect(() => {
    // TODO: Fetch announcements from API
    setAnnouncements(announcementsMockData);
  }, []);

  return (
    <Flex flexDir="row" alignItems="flex-start" w="100%">
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
  );
};

export default AnnouncementsPage;

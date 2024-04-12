import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { Search } from "@mui/icons-material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import {
  Announcement,
  GroupAnnouncements,
} from "../../../types/NotificationTypes";
import { truncateMessage } from "../../../utils/StringUtils";

interface ProcessedGroupAnnouncements {
  all: GroupAnnouncements;
  private: GroupAnnouncements;
  groups: GroupAnnouncements;
}

const formatRooms = (roomIDs: number[]) => {
  // Map each room ID to its formatted string
  const formattedRooms = roomIDs.map((id) => `Room ${id}`);
  // Join the formatted room strings with commas
  return formattedRooms.join(", ");
};

const GroupTab = ({
  roomKey,
  firstAnnouncement,
  setSelectedGroup,
}: {
  roomKey: string;
  firstAnnouncement: Announcement;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const rooms = roomKey.split(",").map(Number);
  return (
    <Box
      onClick={() => setSelectedGroup(roomKey)}
      w="100%"
      p={3}
      borderBottom="solid"
      borderBottomColor="gray.300"
      _hover={{ bg: "purple.100", cursor: "pointer" }}
    >
      <Flex alignItems="center">
        <Box
          borderRadius="full"
          border="1px solid"
          borderColor="purple.300"
          p={1}
          mr={3}
        >
          <Icon
            as={
              rooms.length === 1
                ? PersonOutlineOutlinedIcon
                : PeopleAltOutlinedIcon
            }
            boxSize={10}
            color="purple.main"
          />
        </Box>
        <Flex flexDir="column">
          <Flex justifyContent="space-between" alignItems="center" w="100%">
            <Text as="b">{formatRooms(rooms)}</Text>
            <Text color="gray.500">
              {moment(firstAnnouncement.createdAt).fromNow()}
            </Text>
          </Flex>
          <Text>{truncateMessage(firstAnnouncement.message, 60)}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

const GroupList: React.FC<{
  announcements: GroupAnnouncements;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
}> = ({ announcements, setSelectedGroup }) => {
  const [processedAnnouncements, setProcessedAnnouncements] =
    useState<ProcessedGroupAnnouncements>();

  useEffect(() => {
    const processedData: ProcessedGroupAnnouncements = {
      all: {},
      private: {},
      groups: {},
    };
    Object.keys(announcements).forEach((key) => {
      const rooms = key.split(",").map((room) => parseInt(room.trim(), 10));
      const announcementData = announcements[key];
      if (rooms.length === 1) {
        // Add announcement to 'all' and 'private' if there is only 1 room
        processedData.all[key] = announcementData;
        processedData.private[key] = announcementData;
      } else {
        // Add announcement to 'all' and 'groups' if there are more than 1 room
        processedData.all[key] = announcementData;
        processedData.groups[key] = announcementData;
      }
    });
    setProcessedAnnouncements(processedData);
  }, [announcements]);

  const renderGroupTabs = (announcementsGroup: GroupAnnouncements) => {
    return (
      announcementsGroup &&
      Object.keys(announcementsGroup).map((roomKey) => (
        <GroupTab
          key={roomKey}
          roomKey={roomKey}
          firstAnnouncement={announcementsGroup[roomKey][0]}
          setSelectedGroup={setSelectedGroup}
        />
      ))
    );
  };

  return (
    <Box h="100vh" w="100%" borderRight="solid" borderRightColor="gray.300">
      <Flex flexDir="column" bg="purple.50" w="100%">
        <Flex
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          mt={5}
          mb={4}
          bg="purple.50"
        >
          <InputGroup w="80%" bg="white" ml={5}>
            <InputLeftElement pointerEvents="none">
              <Icon as={Search} color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search" />
          </InputGroup>
          <IconButton
            icon={<EditNoteIcon />}
            aria-label="Edit"
            color="purple.500"
            bg="white"
            _hover={{ bg: "white" }}
            border="solid"
            borderColor="gray.200"
            mr={5}
          />
        </Flex>

        <Tabs isFitted variant="horizontal">
          <TabList borderBottom="solid" borderBottomColor="gray.300" w="100%">
            <Tab>All</Tab>
            <Tab>Private</Tab>
            <Tab>Groups</Tab>
          </TabList>
          <TabPanels bg="white">
            <TabPanel>
              {processedAnnouncements?.all &&
                renderGroupTabs(processedAnnouncements.all)}
            </TabPanel>
            <TabPanel>
              {processedAnnouncements?.private &&
                renderGroupTabs(processedAnnouncements.private)}
            </TabPanel>
            <TabPanel>
              {processedAnnouncements?.groups &&
                renderGroupTabs(processedAnnouncements.groups)}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default GroupList;

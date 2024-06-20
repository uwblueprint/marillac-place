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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  border,
} from "@chakra-ui/react";
import { BorderColor, Search } from "@mui/icons-material";
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

export const formatRooms = (roomIDs: number[]) => {
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

  const [searchRooms, setSearchRooms] = useState<number[]>([]);
  const [allRooms, setAllRooms] = useState([1,2,3,4,5,6]);
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
      Object.keys(announcementsGroup)
      .filter(roomKey => !searchRooms || searchRooms.length === 0 || searchRooms.some(room => roomKey.split(',').map(Number).includes(room)))
      .map((roomKey) => (
      <GroupTab
                key={roomKey}
                roomKey={roomKey}
                firstAnnouncement={announcementsGroup[roomKey][0]}
                setSelectedGroup={setSelectedGroup}
              />
      ))
    );
  };

  const deleteSearchRoom = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, roomId: number) => {
    if(searchRooms.includes(roomId)) {
      setSearchRooms(searchRooms.filter(room => room !== roomId));
    }
  }

  const addRoomToSearch = (roomId: number) => {
    if(!searchRooms.includes(roomId)) {
      setSearchRooms([...searchRooms, roomId]);
    }
  }

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
          <Box width = "100%" marginRight="1.25rem" marginLeft="1.25rem" position="relative" w="100%" bg="white" h="2.5rem" borderRadius="0.375rem" border="1px solid" borderColor="inherit" _hover={{borderColor: "#C5C8D8"}} _focusVisible={{borderColor: "477FC8", boxShadow: "0 0 0 1px #3182ce"}}>
            <Menu>
              <MenuButton width="100%" position="absolute" height="100%"/>
              <MenuList maxH="40vh" overflow="auto" position="absolute">
                {allRooms.filter(room => !searchRooms.includes(room)).map((room) => (
                  <MenuItem onClick={()=>addRoomToSearch(room)} key={room}>Room {room}</MenuItem>
                ))}
              </MenuList>
            </Menu>
            
            <HStack spacing={2} height="100%" paddingLeft="8px">
              <Icon as={Search} color="gray.300" />
              {searchRooms.map((room) => (
                <Tag key={room} variant='solid' height="30px" color='#57469D' border='1px solid #57469D' backgroundColor='#F9F7FF'>
                  <TagLabel textAlign="center"> Room {room} </TagLabel>
                  <TagCloseButton onClick = {(e) => deleteSearchRoom(e, room)} color='#57469D'/>
                </Tag>
              ))}
            </HStack>
          </Box>

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

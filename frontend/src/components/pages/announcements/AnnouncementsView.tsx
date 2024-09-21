import React, { useState } from "react";
import moment from "moment";
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Avatar,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  HStack,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { GroupAnnouncements } from "../../../types/NotificationTypes";
import { formatRooms } from "./AnnouncementsGroups";

const MessageInput = ({
  handlePost,
}: {
  handlePost: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() !== "") {
      handlePost(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex flexDir="row" justifyContent="flex-end" alignItems="flex-end">
        <Input
          placeholder="Type an announcement..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          w="100%"
          mr={4}
        />
        <Button
          w="120px"
          color="white"
          backgroundColor="purple.main"
          type="submit"
        >
          Post
        </Button>
      </Flex>
    </form>
  );
};

type Props = {
  announcements: GroupAnnouncements;
  selectedGroup: string;
  addingNewRoom: boolean;
  setAddingNewRoom: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRooms: number[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<number[]>>;
};

type PropsList = {
  announcements: GroupAnnouncements;
  selectedGroup: string;
};

const AnnouncementsList = ({ announcements, selectedGroup }: PropsList) => {
  if (selectedGroup.length === 0) {
    return null;
  }
  
  return (
    <Box>
      {announcements[selectedGroup].map((announcement, index) => (
        <Box
          key={index}
          backgroundColor="gray.100"
          p="10px"
          ml="30px"
          mr="20px"
          mt="20px"
          borderRadius="10px"
          w="83vh"
        >
          <Flex pl={2} align="center">
            <Avatar name={announcement.author} src="https://bit.ly/2k1H1t6" />
            <Flex flexDir="column" ml={4}>
              <Heading size="sm" fontSize="16px" mt={4} mb={0}>
                {announcement.author}
              </Heading>
              <Text color="gray.main" fontSize="12px">
                {moment(announcement.createdAt).fromNow()}
              </Text>
            </Flex>
          </Flex>
          <Text pl={2} fontSize="16px">
            {announcement.message}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

const AnnouncementsView = ({
  announcements,
  selectedGroup,
  addingNewRoom,
  setAddingNewRoom,
  selectedRooms,
  setSelectedRooms
}: Props): React.ReactElement => {
  const rooms = selectedGroup.split(",").map(Number);
  const [allRooms, setAllRooms] = useState([1,2,3,4,5,6]);

  const addRoomToNewRoom = (roomId: number) => {
    if(!selectedRooms.includes(roomId)) {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  }

  const deleteRoomSelected = (roomId: number) => {
    if(selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(room => room !== roomId));
    }
  }

  const handlePost = (message: string) => {
    if(addingNewRoom && selectedRooms.length > 0) {
      setSelectedRooms([]);
      setAddingNewRoom(false);
    }
  }

  const formatHeader = (roomIDs: number[]) => {
    if(addingNewRoom && selectedGroup === "0"){
      return <Flex fontSize="16px">
        <HStack spacing={4}>
          {selectedRooms.map((room) => (
            <Tag key={room} variant='solid' height="30px" color='#57469D' border='1px solid #57469D' backgroundColor='#F9F7FF'>
              <TagLabel textAlign="center"> Room {room}</TagLabel>
              <TagCloseButton onClick = {() => deleteRoomSelected(room)} color='#57469D'/>
            </Tag>
          ))}
          <Menu>
            <MenuButton>
              <AddCircleOutlineOutlinedIcon sx={{color: "#57469D"}}/>
            </MenuButton>
            <MenuList maxH="40vh" overflow="auto">
              {allRooms.filter(room => !selectedRooms.includes(room)).map((room) => (
                <MenuItem onClick={()=>addRoomToNewRoom(room)} key={room}>Room {room}</MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    }
    return "All Rooms";
  };

  return (
    <Box h="100vh" w="100%">
      <Flex align="left" flexDir="column" h="100%">
        <Box
          p="22px 47px"
          borderBottom="solid"
          borderBottomColor="gray.300"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          h="10vh"
        >
          <h1 style={{ fontSize: "24px", margin: "0" }}>
            {selectedGroup === "" || selectedGroup === "0" ? formatHeader(rooms) : formatRooms(rooms)}
          </h1>
          <IconButton
            aria-label="info"
            color="purple.main"
            backgroundColor="white"
            borderRadius="50%"
            fontSize="30px"
          >
            <InfoOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Box flex={1} h="100vh" overflowY="scroll">
          {selectedGroup !== "0" && <AnnouncementsList
            announcements={announcements}
            selectedGroup={selectedGroup}
          />}
        </Box>
        <Box p="27px 39px">
          <MessageInput handlePost={handlePost} />
        </Box>
      </Flex>
    </Box>
  );
};

export default AnnouncementsView;

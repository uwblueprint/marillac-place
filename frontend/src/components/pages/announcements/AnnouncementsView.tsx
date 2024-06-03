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
} from "@chakra-ui/react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { GroupAnnouncements } from "../../../types/NotificationTypes";

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
  deleteAnnouncement: (room: string, id: number) => void;
};

const AnnouncementsList = ({
  announcements,
  selectedGroup,
  deleteAnnouncement,
}: Props) => {
  if (selectedGroup.length === 0) {
    return null;
  }

  const updateAnnouncement = () => {
    console.log("Implement update announcement");
  };

  return (
    <Box>
      {announcements[selectedGroup] ? (
        announcements[selectedGroup].map((announcement, index) => (
          <Box
            key={index}
            backgroundColor="gray.100"
            p="10px"
            ml="38px"
            mr="38px"
            mt="20px"
            borderRadius="10px"
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
            <Button onClick={updateAnnouncement} mt={2} colorScheme="blue">
              Update Announcement
            </Button>
            <Button
              onClick={() => {
                deleteAnnouncement(selectedGroup, announcement.id);
              }}
              mt={2}
              colorScheme="red"
            >
              Delete Announcement
            </Button>
          </Box>
        ))
      ) : (
        <Text>No announcements found</Text>
      )}
    </Box>
  );
};

const AnnouncementsView = ({
  announcements,
  selectedGroup,
  deleteAnnouncement,
}: Props): React.ReactElement => {
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
        >
          <h1 style={{ fontSize: "24px" }}>All Rooms</h1>
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
          <AnnouncementsList
            announcements={announcements}
            selectedGroup={selectedGroup}
            deleteAnnouncement={deleteAnnouncement}
          />
        </Box>
        <Box p="27px 39px">
          <MessageInput handlePost={() => {}} />
        </Box>
      </Flex>
    </Box>
  );
};

export default AnnouncementsView;

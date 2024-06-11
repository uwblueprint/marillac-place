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
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

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
  updateAnnouncement: (room: string, id: number, message: string) => void;
};

const AnnouncementsList = ({
  announcements,
  selectedGroup,
  deleteAnnouncement,
  updateAnnouncement,
}: Props) => {
  const [editingAnnouncement, setEditingAnnouncement] = useState<number | null>(
    null,
  );
  const [deletingAnnouncement, setDeletingAnnouncement] = useState<
    number | null
  >(null);
  const [editMessage, setEditMessage] = useState("");

  if (selectedGroup.length === 0) {
    return null;
  }

  return (
    <Box>
      {announcements[selectedGroup] ? (
        announcements[selectedGroup].map((announcement, index) => (
          <>
            <Box
              key={index}
              backgroundColor="gray.100"
              p="10px"
              ml="38px"
              mr="38px"
              mt="20px"
              borderRadius="10px"
            >
              <Flex pl={2} justifyContent="space-between">
                <Flex alignItems="center">
                  <Avatar
                    name={announcement.author}
                    src="https://bit.ly/2k1H1t6"
                  />
                  <Flex flexDir="column" ml={4}>
                    <Heading size="sm" fontSize="16px" mt={4} mb={0}>
                      {announcement.author}
                    </Heading>
                    <Text color="gray.main" fontSize="12px">
                      {moment(announcement.createdAt).fromNow()}
                    </Text>
                  </Flex>
                </Flex>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<MoreHorizIcon style={{ color: "grey" }} />}
                  />
                  <MenuList border="2px solid #cccccc">
                    <MenuItem
                      icon={<EditOutlinedIcon />}
                      color="grey"
                      onClick={() => {
                        setEditingAnnouncement(announcement.id);
                        setEditMessage(announcement.message);
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<DeleteOutlineOutlinedIcon />}
                      color="red"
                      onClick={() => {
                        setDeletingAnnouncement(announcement.id);
                      }}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              {editingAnnouncement === announcement.id ? (
                <Flex pl={2} flexDir="column">
                  <Textarea
                    backgroundColor="white"
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    placeholder="Update your announcement..."
                  />
                  <Flex justifyContent="right">
                    <Button
                      onClick={() => setEditingAnnouncement(null)}
                      mt={2}
                      colorScheme="gray"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Here you will handle the save action later
                        setEditingAnnouncement(null);
                        updateAnnouncement(
                          selectedGroup,
                          announcement.id,
                          editMessage,
                        );
                      }}
                      mt={2}
                      color="white"
                      backgroundColor="purple.main"
                    >
                      Save
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <Text pl={2} fontSize="16px">
                  {announcement.message}
                </Text>
              )}
            </Box>
            {deletingAnnouncement === announcement.id && (
              <Box
                position="fixed"
                top="0"
                left="0"
                w="100vw"
                h="100vh"
                backgroundColor="rgba(0, 0, 0, 0.25)"
                zIndex="100"
              >
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  backgroundColor="white"
                  p="10"
                  borderRadius="10px"
                  boxShadow="0 4px 8px 0 rgba(0, 0, 0, 0.25)"
                >
                  <Heading size="md" mb={4}>
                    Delete Announcement
                  </Heading>
                  <Text fontSize="16px" mb={4}>
                    Are you sure you want to delete this announcement?
                  </Text>
                  <Flex justifyContent="flex-end">
                    <Button
                      onClick={() => setDeletingAnnouncement(null)}
                      color="black.main"
                      backgroundColor="white"
                      border="2px solid #cccccc"
                      paddingX="20px"
                      mr={2}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Here you will handle the delete action later
                        setDeletingAnnouncement(null);
                        deleteAnnouncement(selectedGroup, announcement.id);
                      }}
                      color="#D34C5C"
                      backgroundColor="white"
                      border="2px solid #D34C5C"
                      paddingX="20px"
                      leftIcon={
                        <DeleteOutlineOutlinedIcon
                          style={{ marginRight: "-5px" }}
                        />
                      }
                    >
                      Delete
                    </Button>
                  </Flex>
                </Box>
              </Box>
            )}
          </>
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
  updateAnnouncement,
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
            updateAnnouncement={updateAnnouncement}
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

import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Divider,
  CloseButton,
} from "@chakra-ui/react";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import Announcement from "./Announcement";

type ParticipantAnnouncementFocusedProps = {
  announcement: Announcement;
  setFocusedId: (id: string | null) => void;
  setMarkedAsRead(markedRead: boolean): void;
  setPinned(pinned: boolean): void;
};

export default function ParticipantAnnouncementFocused({
  announcement,
  setFocusedId,
  setMarkedAsRead,
  setPinned,
}: ParticipantAnnouncementFocusedProps) {
  return (
    <Box w="100%" p="20px">
      <Flex align="center" justify="space-between" mb="8px">
        <Flex align="center" gap="10px">
          <Text textStyle="mobile.h1" color="#04454D">
            Admin To {announcement.allRooms ? "All Rooms" : "Your Room"}
          </Text>
        </Flex>
        <Text textStyle="mobile.c2" color="text.light.secondary">
          {announcement.time}
        </Text>
        <CloseButton
          onClick={() => setFocusedId(null)}
          size="lg"
          color="red.500"
        />
      </Flex>

      <Flex align="center" gap="10px" mb="12px">
        {announcement.importance !== 0 && (
          <Flex align="center" gap="4px" color="red.500">
            <PriorityHighIcon fontSize="small" />
            <Text textStyle="mobile.c2" color="red.500">
              Priority
            </Text>
          </Flex>
        )}
        {announcement.isPinned && (
          <Flex align="center" gap="4px" color="orange.500">
            <PushPinIcon fontSize="small" />
            <Text textStyle="mobile.c2" color="orange.500">
              Pinned
            </Text>
          </Flex>
        )}
      </Flex>
      <Divider my="12px" color="#C5C8D8" />

      <Text textStyle="mobile.p2" mb="24px">
        {announcement.message}
      </Text>

      <Flex gap="10px">
        <Button
          variant="secondaryOutlineMobile"
          onClick={() => {
            console.log("Marked as read/unread");
            setMarkedAsRead(!announcement.hasRead);
          }}
        >
          <Flex align="center" gap="6px">
            {announcement.hasRead ? (
              <MarkEmailUnreadIcon fontSize="small" />
            ) : (
              <MarkEmailReadIcon fontSize="small" />
            )}
            Mark as {announcement.hasRead ? "Unread" : "Read"}
          </Flex>
        </Button>
        <Button
          variant="secondaryOutlineMobile"
          onClick={() => setPinned(!announcement.isPinned)}
        >
          <Flex align="center" gap="6px">
            {announcement.isPinned ? (
              <PushPinIcon fontSize="small" sx={{ color: "#E67D4F" }} />
            ) : (
              <PushPinOutlinedIcon fontSize="small" />
            )}

            {announcement.isPinned ? "Unpin" : "Pin"}
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
}

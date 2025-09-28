import { Flex, Text } from "@chakra-ui/react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import PushPinIcon from "@mui/icons-material/PushPin";
import CircleIcon from "@mui/icons-material/Circle";
import React from "react";

type ParticipantAnnouncementCardProps = {
  announcement: any;
  setFocusedId: (focused: string | null) => void;
};

export default function ParticipantAnnouncementCard({
  announcement,
  setFocusedId,
}: ParticipantAnnouncementCardProps) {
  return (
    <Flex
      w="100%"
      borderTop="1px solid"
      borderColor="neutral.300"
      paddingY="15px"
      paddingLeft="25px"
      flexDir="column"
      position="relative"
      onClick={() => {
        setFocusedId(announcement.id);
      }}
    >
      {!announcement.hasRead && (
        <CircleIcon
          sx={{
            fontSize: "12px",
            color: "#E67D4F",
            position: "absolute",
            top: "20px",
            left: "0px",
          }}
        />
      )}
      <Flex alignItems="center" justifyContent="space-between">
        {announcement.allRooms ? (
          <Flex alignItems="center" gap="10px">
            <PeopleOutlineIcon fontSize="small" />
            <Text textStyle="mobile.h3">All Rooms</Text>
            <Text textStyle="mobile.b1" color="text.light.secondary">
              {announcement.time}
            </Text>
          </Flex>
        ) : (
          <Flex alignItems="center" gap="10px">
            <PersonOutlineIcon fontSize="small" />
            <Text textStyle="mobile.h3">Your Room</Text>
            <Text textStyle="mobile.b1" color="text.light.secondary">
              {announcement.time}
            </Text>
          </Flex>
        )}

        <Flex>
          {announcement.importance !== 0 && (
            <PriorityHighIcon fontSize="small" sx={{ color: "#D34C5C" }} />
          )}
          {announcement.isPinned && (
            <PushPinIcon fontSize="small" sx={{ color: "#E67D4F" }} />
          )}
        </Flex>
      </Flex>
      <Text textStyle="mobile.b1" marginTop="5px" h="45px" overflow="hidden">
        {announcement.message}
      </Text>
    </Flex>
  );
}

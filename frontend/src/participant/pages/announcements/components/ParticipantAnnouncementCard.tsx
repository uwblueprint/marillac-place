import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Dot, ExclamationMark} from "../../../../ui/icons/NotificationIcons";
import { Group, } from "../../../../ui/icons/BadgeIcons";
import { Profile, } from "../../../../ui/icons/MiscIcons";
import { Pin } from "../../../../ui/icons/ActionIcons";
import { formatDateTimeString } from "../../../../helpers/formatDateTime";

type ParticipantAnnouncementCardProps = {
  allRooms: boolean;
  message: string;
  importance: number;
  hasRead: boolean;
  isPinned: boolean;
  time: string;
  userAnnouncementId: number;
};

export default function ParticipantAnnouncementCard({
  userAnnouncementId,
  allRooms,
  message,
  importance,
  hasRead,
  isPinned,
  time,
}: ParticipantAnnouncementCardProps) {
  return (
    <Flex
      w="100%"
      borderTop="1px solid"
      borderColor="neutral.300"
      paddingTop="12px"
      paddingLeft="25px"
      flexDir="column"
      position="relative"
    >
      {!hasRead && (
        <Flex position="absolute" top="42px" left="0px">
          <Dot />
        </Flex>
      )}

      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap="10px">
          {allRooms ? (
            <>
              <Group />
              <Text textStyle="mobile.b0">All Rooms</Text>
            </>
          ) : (
            <>
              <Profile />
              <Text textStyle="mobile.b0">Your Room</Text>
            </>
          )}
          <Text textStyle="mobile.b1" color="text.light.secondary">
            {formatDateTimeString(time)}
          </Text>
        </Flex>

        <Flex gap="12px" paddingRight="4px">
          {importance !== 0 && (
            <ExclamationMark />
          )}
          {isPinned && <Pin />}
        </Flex>
      </Flex>

      <Text
        textStyle="mobile.b1"
        marginTop="5px"
        minH="25px"
        maxH="45px"
        overflow="hidden"
      >
        {message}
      </Text>
    </Flex>
  );
}

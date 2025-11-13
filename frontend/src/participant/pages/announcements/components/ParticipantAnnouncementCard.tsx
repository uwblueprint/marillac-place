import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import notification from "../../../icons/announcements/notification.svg";
import group from "../../../icons/announcements/group.svg";
import profile from "../../../icons/announcements/profile.svg";
import important from "../../../icons/announcements/important.svg";
import orangepin from "../../../icons/announcements/orangepin.svg";
import Icon from "../../../../icons/Icon";
import { displayDate2 } from "../../../../utils/formatDateTime";

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
          <Icon icon={notification} width="12px" height="12px" />
        </Flex>
      )}

      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap="10px">
          {allRooms ? (
            <>
              <Icon icon={group} width="15px" height="15px" />
              <Text textStyle="mobile.b0">All Rooms</Text>
            </>
          ) : (
            <>
              <Icon icon={profile} width="12px" height="12px" />
              <Text textStyle="mobile.b0">Your Room</Text>
            </>
          )}
          <Text textStyle="mobile.b1" color="text.light.secondary">
            {displayDate2(new Date(time))}
          </Text>
        </Flex>

        <Flex gap="12px" paddingRight="4px">
          {importance !== 0 && (
            <Icon icon={important} width="3.8px" height="3.8px" />
          )}
          {isPinned && <Icon icon={orangepin} width="10px" height="10px" />}
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

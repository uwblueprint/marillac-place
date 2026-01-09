import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Group } from "../../../../ui/icons/BadgeIcons";
import { Profile } from "../../../../ui/icons/MiscIcons";
import { ExclamationMark, Dot } from "../../../../ui/icons/NotificationIcons";
import { Pin } from "../../../../ui/icons/ActionIcons";
import { formatDateV3 } from "../../../../helpers/formatDateTime";
import { ReceivedAnnouncement } from "../../../../types/models";
import { Priority } from "../../../../types/enums";

type ParticipantAnnouncementCardProps = {
  announcement: ReceivedAnnouncement;
};

export default function ParticipantAnnouncementCard({ announcement }: ParticipantAnnouncementCardProps) {
  const importance = announcement.announcement ? announcement.announcement.priority : Priority.NORMAL;
  const date = announcement.announcement ? new Date(announcement.announcement.date) : new Date();

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
      {!announcement.read && (
        <Flex position="absolute" top="42px" left="0px">
          <Dot size={12} />
        </Flex>
      )}

      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap="10px">
          <Text textStyle="mobile.b0">New Announcement</Text>
          <Text textStyle="mobile.b1" color="text.light.secondary">
            {formatDateV3(date)}
          </Text>
        </Flex>

        <Flex gap="12px" paddingRight="4px">
          {importance !== Priority.NORMAL && (
            <ExclamationMark size={4} />
          )}
          {announcement.pinned && <Pin size={10} color="secondary.700" />}
        </Flex>
      </Flex>

      <Text
        textStyle="mobile.b1"
        marginTop="5px"
        minH="25px"
        maxH="45px"
        overflow="hidden"
      >
        {announcement.announcement?.message}
      </Text>
    </Flex>
  );
}
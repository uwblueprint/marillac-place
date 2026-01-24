import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { ExclamationMark, Dot } from "../../../../ui/icons/NotificationIcons";
import { Pin } from "../../../../ui/icons/ActionIcons";
import { formatDateV3 } from "../../../../helpers/formatDateTime";
import { Announcement, ReceivedAnnouncement } from "../../../../types/models";
import { Priority } from "../../../../types/enums";
import { toTitleCase } from "../../../../helpers/stringUtils";

type ParticipantAnnouncementCardProps = {
  announcement: ReceivedAnnouncement;
};

export default function ParticipantAnnouncementCard({ announcement }: ParticipantAnnouncementCardProps) {
  const details: Announcement | undefined = announcement.announcement;
  if (!details || (details && (!details.topic || !details.date || !details.message || !details.priority))) {
    return (
      <Flex
        w="100%"
        borderTop="1px solid"
        borderColor="background.border"
        paddingTop="12px"
        paddingLeft="25px"
        flexDir="column"
        position="relative"
      >
        <Text textStyle="web.b1" color="indicate.brightRed" textAlign="center">
          Unable to load announcement details.
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      w="100%"
      borderTop="1px solid"
      borderColor="background.border"
      paddingTop="12px"
      flexDir="column"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="baseline" gap="10px">
          {!announcement.read && <Dot size={10} />}
          <Text textStyle="s1">{toTitleCase(details.topic)}</Text>
          <Text textStyle="b2" color="text.medium">
            {formatDateV3(new Date(details.date))}
          </Text>
        </Flex>

        <Flex gap="8px">
          {(details.priority !== Priority.NORMAL) && (
            <ExclamationMark size={12} />
          )}
          {announcement.pinned && <Pin size={12} color="brand.secondaryDark" />}
        </Flex>
      </Flex>

      <Text
        textStyle="b1"
        marginTop="5px"
        minH="25px"
        maxH="45px"
        overflow="hidden"
      >
        {details.message}
      </Text>
    </Flex>
  );
}

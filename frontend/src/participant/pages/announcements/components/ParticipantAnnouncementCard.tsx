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
        borderColor="neutral.300"
        paddingTop="12px"
        paddingLeft="25px"
        flexDir="column"
        position="relative"
      >
        <Text textStyle="web.b2" color="#E30000" textAlign="center">
          Unable to load announcement details.
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      w="100%"
      borderTop="1px solid"
      borderColor="neutral.300"
      paddingTop="12px"
      flexDir="column"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="baseline" gap="10px">
          {!announcement.read && <Dot size={12} />}
          <Text textStyle="mobile.b0">{toTitleCase(details.topic)}</Text>
          <Text textStyle="mobile.b2" color="text.light.secondary">
            {formatDateV3(new Date(details.date))}
          </Text>
        </Flex>

        <Flex gap="8px">
          {(details.priority !== Priority.NORMAL) && (
            <ExclamationMark size={14} />
          )}
          {announcement.pinned && <Pin size={14} color="secondary.700" />}
        </Flex>
      </Flex>

      <Text
        textStyle="mobile.b1"
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
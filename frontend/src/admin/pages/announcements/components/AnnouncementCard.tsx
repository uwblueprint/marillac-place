import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Box, Text, Flex } from "@chakra-ui/react";
import { DELETE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { Priority } from "../../../../types/enums";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { ExclamationMark } from "../../../../ui/icons/NotificationIcons";
import { Marker, Trash } from "../../../../ui/icons/ActionIcons";

type AnnouncementCardProps = {
  announcement_id: any;
  room: string;
  message: string;
  timestamp: string;
  priority: Priority;
  refetch: () => void;
};

export default function AnnouncementCard({
  announcement_id,
  room,
  message,
  timestamp,
  priority,
  refetch,
}: AnnouncementCardProps) {
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState<string>("");

  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT);
  const handleDeleteAnnouncement = async (aid: number) => {
    setError("");
    try {
      await deleteAnnouncement({
        variables: { aid },
      });

      refetch();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <WidgetContainer
      width="100%"
      height="100%"
      paddingX="20px"
      paddingY="12px"
      bg_color="neutral.100"
    >
      <Flex direction="row" justify="space-between" align="center" gap="10px">
        <Flex direction="column" flex="1">
          <Flex align="center" gap={3}>
            <Text textStyle="web.c1" fontWeight={700}>
              {room}
            </Text>
            <Flex>
              {(priority === Priority.HIGH ||
                priority === Priority.CRITICAL) && <ExclamationMark />}
              {priority === Priority.CRITICAL && <ExclamationMark />}
            </Flex>
          </Flex>

          <Text
            textStyle="web.s1"
            fontWeight={600}
            mt={1}
            whiteSpace="pre-line"
            color="#3f3f3f"
          >
            {message}
          </Text>

          <Text textStyle="web.b3" color="text.light.secondary" mt={2}>
            {timestamp}
          </Text>
        </Flex>

        <Flex align="center" gap="15px" ml="10px">
          <Flex onClick={() => setEdit(true)} cursor="pointer">
            <Marker size={20} />
          </Flex>
          <Flex
            onClick={() => handleDeleteAnnouncement(announcement_id)}
            cursor="pointer"
          >
            <Trash size={20} />
          </Flex>
        </Flex>
      </Flex>
      {edit && (
        <EditAnnouncementModal
          refetch={refetch}
          setIsOpen={() => setEdit(false)}
          announcementId={announcement_id}
          sendTo={room}
          initialMessage={message}
          initialPriority={priority}
        />
      )}
    </WidgetContainer>
  );
}

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Box, Text, Flex } from "@chakra-ui/react";
import { DELETE_ANNOUNCEMENT } from "../../../../gql/announcementRequests";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { Priority } from "../../../../types/enums";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { ExclamationMark } from "../../../../ui/icons/NotificationIcons";
import { Marker, Trash } from "../../../../ui/icons/ActionIcons";
import useNotification from "../../../../hooks/useNotification";

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
  const { sendNotification } = useNotification();
  const [deleteAnnouncement] = useMutation(DELETE_ANNOUNCEMENT);
  const handleDeleteAnnouncement = async (aid: number) => {
    setError("");
    try {
      await deleteAnnouncement({
        variables: { aid },
      });
      
      refetch();
      sendNotification("Announcement deleted successfully");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <WidgetContainer
      width="100%"
      height="100%"
      paddingX="18px"
      paddingY="12px"
      bg_color="background.highlight"
    >
      <Flex direction="row" justify="space-between" align="center" gap="20px">
        <Flex direction="column" flex="1">
          <Flex align="center" gap={1.5}>
            <Text textStyle="s1">
              {room}
            </Text>
            <Flex>
              {(priority === Priority.HIGH || priority === Priority.CRITICAL) && <ExclamationMark />}
              {priority === Priority.CRITICAL && <ExclamationMark />}
            </Flex>
          </Flex>

          <Text
            textStyle="b1"
            mt={1}
            whiteSpace="pre-line"
            color="text.dark"
          >
            {message}
          </Text>

          <Text textStyle="b2" color="text.medium" mt={1}>
            {timestamp}
          </Text>
        </Flex>

        <Flex align="center" gap="15px">
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

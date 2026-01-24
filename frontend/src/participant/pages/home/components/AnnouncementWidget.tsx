import React, { useContext } from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { GET_RECEIVED_ANNOUNCEMENTS } from "../../../../gql/receivedAnnouncementRequests";
import { formatDateV3 } from "../../../../helpers/formatDateTime";
import { ParticipantContext } from "../../../ParticipantContext";
import { PARTICIPANTS_ANNOUNCEMENTS_PAGE } from "../../../../constants/routes";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { ReceivedAnnouncement } from "../../../../types/models";

type AnnouncementWidgetProps = {
  pid: number;
}

export default function AnnouncementWidget({ pid }: AnnouncementWidgetProps) {
  const navigate = useNavigate();

  const {
    data: announcementData,
    loading: announcementLoading,
    error: announcementError,
  } = useQuery(GET_RECEIVED_ANNOUNCEMENTS, {
    variables: { pid },
  });

  const announcements = announcementData?.getReceivedAnnouncements ?? [];

  return (
    <WidgetContainer 
      width="100%"
      height="fit-content"
      paddingX="16px"
      loading={announcementLoading}
      error={announcementError?.message}
    >
      <Flex w="100%" justifyContent="space-between" alignItems="center" mb={announcements.length > 0 ? "8px" : "0px"}>
        <Text textStyle="s1">Recent Announcements</Text>
        <UnderlineButton
          label="View All"
          action={() => navigate(PARTICIPANTS_ANNOUNCEMENTS_PAGE)}
        />
      </Flex>

      {announcements.slice(0, 5).map((announcement: ReceivedAnnouncement, index: number) => (
        <Flex key={index} width="100%" flexDir="column">
          {index > 0 && <Divider orientation="horizontal" borderColor="background.border" my="8px" />}
          <Text textStyle="b1" mb="2px">{announcement.announcement?.message}</Text>
          <Text textStyle="b2" color="text.medium">{formatDateV3(new Date(announcement.announcement?.date ?? ""))}</Text>
        </Flex>
      ))}
    </WidgetContainer>
  );
}

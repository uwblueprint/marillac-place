import React, { useContext } from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import { GET_RECEIVED_ANNOUNCEMENTS } from "../../../../gql/receivedAnnouncementRequests";
import { formatDateTimeString } from "../../../../helpers/formatDateTime";
import { ParticipantContext } from "../../../ParticipantContext";
import * as ROUTES from "../../../../constants/routes";


export default function AnnouncementWidget() {
  const participant = useContext(ParticipantContext);
  const pid = participant?.pid ?? "";
  const navigate = useNavigate();

  const {
    data: announcementData,
    loading: announcementLoading,
    error: announcementError,
  } = useQuery(GET_RECEIVED_ANNOUNCEMENTS, {
    variables: {
      pid,
    },
  });

  if (announcementLoading) return <Text>Loading announcements.</Text>;
  if (announcementError) return <Text>Error fetching announcements.</Text>;

  return (
    <WidgetContainer width="100%">
      <>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Text textStyle="mobile.h2">Announcements</Text>
          <Text
            textStyle="mobile.h3"
            color="primary.700"
            fontWeight="600"
            textDecoration="underline"
            cursor="pointer"
            _hover={{
              color: "primary.700",
              opacity: 0.8,
            }}
            onClick={() => navigate(ROUTES.PARTICIPANTS_ANNOUNCEMENTS_PAGE)}
          >
            Announcements
          </Text>
        </Flex>

        {announcementData.getReceivedAnnouncements.map(
          (announcement: any) => (
            <Flex
              width="100%"
              flexDir="column"
              gap="6px"
              key={announcement.announcement_id}
            >
              <Divider borderColor="neutral.300" />
              <Text paddingTop="4px" textStyle="mobile.b1">
                {announcement.announcement.message}
              </Text>
              <Text textStyle="mobile.b1" color="text.light.secondary">
                {formatDateTimeString(announcement.announcement.date)}
              </Text>
            </Flex>
          )
        )}
      </>
    </WidgetContainer>
  );
}

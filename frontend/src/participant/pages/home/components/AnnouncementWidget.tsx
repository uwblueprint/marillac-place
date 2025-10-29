import React, { useContext } from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import WidgetContainer from "../../../common/WidgetContainer";
import { GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID } from "../../../../gql/queries";
import { AnnouncementDisplayInfo } from "../../../../types/AnnouncementTypes";
import { getNow, getRecentDate } from "../../../../utils/formatDateTime";
import { ParticipantContext } from "../../../common/ParticipantContext";
import * as ROUTES from "../../../../constants/routes";

export default function AnnouncementWidget() {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.id ?? "";
  const navigate = useNavigate();

  const {
    data: announcementData,
    loading: announcementLoading,
    error: announcementError,
  } = useQuery(GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID, {
    variables: {
      participant_id: participantId,
    },
  });

  if (announcementLoading) return <Text>Loading announcements.</Text>;
  if (announcementError) return <Text>Error fetching announcements.</Text>;

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      month: "short",
      day: "numeric",
    };

    const parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(date);

    const get = (type: string) =>
      parts.find((p) => p.type === type)?.value || "";

    const hour = get("hour");
    const minute = get("minute");
    const month = get("month");
    const day = get("day");
    const dayPeriod = get("dayPeriod").toLowerCase();

    return `${hour}:${minute} ${dayPeriod}, ${month} ${day}`;
  };

  return (
    <WidgetContainer>
      <>
        <Flex flexDir="row" justifyContent="space-between">
          <Text textStyle="mobile.h2">Announcements</Text>
          <Text
            textStyle="mobile.b1"
            onClick={() => navigate(ROUTES.PARTICIPANTS_ANNOUNCEMENTS_PAGE)}
            textDecoration="underline"
            cursor="pointer"
          >
            Announcements
          </Text>
        </Flex>

        {announcementData.getAnnouncementsByParticipantId.map(
          (announcement: AnnouncementDisplayInfo) => (
            <Flex
              width="100%"
              flexDir="column"
              gap="6px"
              key={announcement.announcement_id}
            >
              <Divider borderColor="neutral.300" />
              <Text paddingTop="4px" textStyle="mobile.b1">
                {announcement.message}
              </Text>
              <Text textStyle="mobile.b1" color="text.light.secondary">
                {formatDate(new Date(announcement.creation_date))}
              </Text>
            </Flex>
          )
        )}
      </>
    </WidgetContainer>
  );
}

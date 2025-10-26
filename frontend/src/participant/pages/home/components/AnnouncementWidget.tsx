import React, { useContext } from "react";
import { Divider, Flex, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import Widget from "../elements/Widget";
import { GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID_AND_DATE } from "../../../../gql/queries";
import { AnnouncementDisplayInfo } from "../../../../types/AnnouncementTypes";
import { getNow, getRecentDate } from "../../../../utils/formatDateTime";
import { ParticipantContext } from "../../../common/ParticipantContext";

export default function AnnouncementWidget() {
  const participant = useContext(ParticipantContext);
  const participantId = participant?.id ?? "";

  const {
    data: announcementData,
    loading: announcementLoading,
    error: announcementError,
  } = useQuery(GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID_AND_DATE, {
    variables: {
      participant_id: participantId,
      start_date: getRecentDate(7, true),
      end_date: getNow(),
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

    const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

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
    <Widget
      title="Announcements"
      linkTitle="Announcements"
      navigateTo="announcements"
    >
      <Flex flexDir="column" gap="12px">
        {announcementData.getAnnouncementsByParticipantIdAndDate.map(
          (announcement: AnnouncementDisplayInfo) => (
            <Flex
              width="100%"
              flexDir="column"
              gap="6px"
              key={announcement.announcement_id}
            >
              <Divider />
              <Text paddingTop="6px" textStyle="mobile.b1">
                {announcement.message}
              </Text>
              <Text textStyle="mobile.b1" color="text.light.secondary">
                {formatDate(new Date(announcement.creation_date))}
              </Text>
            </Flex>
          )
        )}
      </Flex>
    </Widget>
  );
}

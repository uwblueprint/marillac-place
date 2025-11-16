import { Flex, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ANNOUNCEMENTS_FROM_TODAY } from "../../../../gql/announcementRequests";

import { ROOM_NUMBERS } from "../../../../constants/rooms";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { ADMIN_ANNOUNCEMENTS_PAGE } from "../../../../constants/routes";
import { Announcement } from "../../../../types/models";

type AnnouncementDisplayInfo = {
  announcement_id: number;
  rooms: number[];
  creation_date: Date;
  message: string;
};

const getRoomString = (rooms: number[]) => {
  if (rooms.length === 1) {
    return `Room ${rooms[0]}`;
  }
  if (rooms.length === ROOM_NUMBERS.length) {
    return "All Rooms";
  }
  return `Rooms ${rooms.join(", ")}`;
};

const AnnouncementCard: React.FC<{ announcement: AnnouncementDisplayInfo }> = ({
  announcement,
}) => {
  const formatDate = (date: Date) => {
    return date
      .toLocaleString("en-ca", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  return (
    <Flex
      flexDir="column"
      width="100%"
      bg="neutral.100"
      border="1px solid"
      borderColor="neutral.300"
      rounded="8px"
      paddingX="16px"
      paddingY="12px"
      gap="5px"
    >
      <Flex width="100%" alignItems="baseline">
        <Text textStyle="web.b2" fontWeight={600} color="black">
          {getRoomString(announcement.rooms)}
        </Text>
        <Text textStyle="web.b3" color="text.light.secondary" marginLeft="20px">
          posted at {formatDate(announcement.creation_date)}
        </Text>
      </Flex>
      <Flex width="100%">
        <Text textStyle="web.b2" color="black">
          {announcement.message}
        </Text>
      </Flex>
    </Flex>
  );
};

const AnnouncementSection = () => {
  const {
    loading: getAnnouncementsLoading,
    error: getAnnouncementsError,
    data: getAnnouncementsData,
  } = useQuery<{ getAnnouncementsFromToday: Announcement[] }>(GET_ANNOUNCEMENTS_FROM_TODAY);

  const navigate = useNavigate();
  const announcements: AnnouncementDisplayInfo[] = useMemo(() => {
    const todaysAnnouncements = getAnnouncementsData?.getAnnouncementsFromToday ?? [];

    return todaysAnnouncements.map((announcement: Announcement) => {
      const receivedAnnouncements = announcement.ReceivedAnnouncement ?? [];
      const roomNumbers = receivedAnnouncements
        .map((received) => received?.participant?.room)
        .filter((room): room is number => typeof room === "number");
      const rooms = Array.from(new Set(roomNumbers)).sort((a, b) => a - b);

      const parsedDate = new Date(announcement.date);
      const creationDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

      return {
        announcement_id: announcement.aid,
        rooms,
        creation_date: creationDate,
        message: announcement.message,
      };
    });
  }, [getAnnouncementsData]);

  return (
    <WidgetContainer 
      width="100%"
      height="calc(100% - 325px)"
      paddingX="16px" 
      paddingY="16px"
      loading={getAnnouncementsLoading}
      error={getAnnouncementsError?.message}
    >
      <Flex
        w="100%"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex
          w="100%"
          flexDir="row"
          justifyContent="flex-start"
          alignItems="center"
          pl="2px"
          pb="4px"
          gap="12px"
        >
          <Text textStyle="web.h3" color="primary.700">
            Announcements
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
            {announcements.length} new post{announcements.length === 1 ? "" : "s"} today
          </Text>
        </Flex>

        <UnderlineButton
          label="View All"
          action={() => navigate(ADMIN_ANNOUNCEMENTS_PAGE)}
        />
      </Flex>
      <Flex
        w="100%"
        flexGrow={1}
        flexDir="column"
        gap="8px"
        overflowY="auto"
        alignItems="center"
        justifyContent="top"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {announcements.length === 0 ? (
          <Text textStyle="web.b2" color="text.light.secondary" mt="75px">
            No Announcements
          </Text>
        ) : (
          <Flex
            width="100%"
            height="100%"
            flexDir="column"
            justifyContent="flex-start"
            gap="10px"
          >
            {announcements.map((announcement: AnnouncementDisplayInfo) => {
              return (
                <AnnouncementCard
                  key={announcement.announcement_id}
                  announcement={announcement}
                />
              );
            })}
          </Flex>
        )}
      </Flex>
    </WidgetContainer>
  );
};

export default AnnouncementSection;

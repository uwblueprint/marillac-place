import { Flex, Text, Link } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { Link as RouterLink } from "react-router-dom";
import { GET_ANNOUNCEMENTS_FROM_TODAY } from "../../../../gql/announcementRequests";
import { Announcement, ReceivedAnnouncement } from "../../../../types/models";
import { ROOM_NUMBERS } from "../../../../constants/rooms";

const getRoomString = (announcements: Announcement) => {
  const rooms = (
    announcements.ReceivedAnnouncement?.map(
      (ra: ReceivedAnnouncement) => ra.participant?.room
    ).filter((room) => room !== undefined) ?? []
  ).sort();

  if (announcements.ReceivedAnnouncement?.length === 1) {
    return `Room ${rooms[0]}`;
  }

  if (rooms.length === ROOM_NUMBERS.length) {
    return "All Rooms";
  }
  return `Rooms ${rooms.join(", ")}`;
};

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({
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
          {getRoomString(announcement)}
        </Text>
        <Text textStyle="web.b3" color="text.light.secondary" marginLeft="20px">
          posted at {formatDate(new Date(announcement.date))}
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
    data,
  } = useQuery(GET_ANNOUNCEMENTS_FROM_TODAY);

  const announcements: Announcement[] = data?.getAnnouncementsFromToday || [];

  return (
    <Flex
      flexGrow={1}
      height="calc(100% - 330px)"
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      flexDir="column"
      gap="10px"
      justifyContent="flex-start"
      marginRight="10px"
    >
      {/* Title Row */}
      <Flex
        w="100%"
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        px="2px"
      >
        <Flex flexDir="row" gap="20px" alignItems="baseline">
          <Text textStyle="web.h3" color="primary.700">
            Announcements
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary">
            {announcements.length} new post
            {announcements.length === 1 ? "" : "s"} today
          </Text>
        </Flex>
        <Link
          as={RouterLink}
          to="/admin/announcements"
          textStyle="web.b3"
          fontFamily="Nunito"
          fontWeight={600}
          color="black"
          textDecoration="underline"
          _hover={{
            textDecoration: "none",
          }}
        >
          View All
        </Link>
      </Flex>
      <Flex
        alignItems="center"
        overflow="scroll"
        height="100%"
        justifyContent="center"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {getAnnouncementsLoading ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            Loading...
          </Text>
        ) : getAnnouncementsError ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            {getAnnouncementsError?.message || "An error occurred"}
          </Text>
        ) : announcements.length === 0 ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            No Announcements Yet
          </Text>
        ) : (
          <Flex
            width="100%"
            height="100%"
            flexDir="column"
            justifyContent="flex-start"
            gap="10px"
          >
            {announcements.map((announcement: Announcement) => {
              return (
                <AnnouncementCard
                  key={announcement.aid}
                  announcement={announcement}
                />
              );
            })}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AnnouncementSection;

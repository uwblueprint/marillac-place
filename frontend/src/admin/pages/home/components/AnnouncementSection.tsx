import { Flex, Text, Link } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ANNOUNCEMENTS_FROM_TODAY } from "../../../../gql/announcementRequests";
import { Announcement, ReceivedAnnouncement } from "../../../../types/models";
import { ROOM_NUMBERS } from "../../../../constants/rooms";
import { formatTimeString } from "../../../../helpers/formatDateTime";
import WidgetContainer from "../../../../ui/containers/WidgetContainer";
import UnderlineButton from "../../../../ui/buttons/UnderlineButton";
import { ADMIN_ANNOUNCEMENTS_PAGE } from "../../../../constants/routes";
import { getRoomString } from "../../../../helpers/stringUtils";

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({
  announcement,
}) => {
  return (
    <WidgetContainer
      bg_color="neutral.100"
      width="100%"
      paddingX="20px"
      paddingY="12px"
    >
      <Flex flexDir="column" width="100%" gap="5px">
        <Flex width="100%" alignItems="baseline">
          <Text textStyle="web.b2" fontWeight={600} color="black">
            {getRoomString(announcement)}
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary" marginLeft="10px">
            posted at {formatTimeString(announcement.date)}
          </Text>
        </Flex>
        <Flex width="100%">
          <Text textStyle="web.b2" color="black">
            {announcement.message}
          </Text>
        </Flex>
      </Flex>
    </WidgetContainer>
  );
};

const AnnouncementSection = () => {
  const navigate = useNavigate();

  const {
    loading: getAnnouncementsLoading,
    error: getAnnouncementsError,
    data,
  } = useQuery(GET_ANNOUNCEMENTS_FROM_TODAY);

  const announcements: Announcement[] = data?.getAnnouncementsFromToday || [];

  return (
    <WidgetContainer
      bg_color="transparent"
      width="100%"
      height="calc(100% - 330px)"
      paddingY="12px"
      paddingX="20px"
      loading={getAnnouncementsLoading}
      error={getAnnouncementsError?.message}
    >
      <Flex
        w="100%"
        h="40px"
        flexDir="row"
        justifyContent="space-between"
        alignItems="baseline"
        paddingBottom="10px"
      >
        <Flex gap="10px" alignItems="baseline">
          <Text textStyle="web.h3" color="primary.700" pl="5px">
            Announcements
          </Text>
          <Text textStyle="web.b3" color="text.light.secondary">
            {announcements.length} new post{announcements.length === 1 ? "" : "s"} today
          </Text>
        </Flex>
        <UnderlineButton
          label="View All"
          action={() => navigate(ADMIN_ANNOUNCEMENTS_PAGE)}
        />
      </Flex>
      <Flex 
        gap="10px"
        flexDir="column"
        alignItems="center"
        justifyContent={announcements.length > 0 ? "flex-start" : "center"}
        height="calc(100% - 42px)"
        overflow="scroll"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {announcements.length > 0 ? (
          announcements.map((announcement: Announcement) => (
            <AnnouncementCard key={announcement.aid} announcement={announcement} />
          ))
        ) : (
          <Text textStyle="web.b2" color="text.light.secondary">
            No Announcements Yet
          </Text>
        )}
      </Flex>
    </WidgetContainer>
  );
};

export default AnnouncementSection;

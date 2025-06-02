import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Link as RouterLink } from "react-router-dom";
import { GET_ANNOUNCEMENTS_IN_DATE_RANGE } from "../../../../gql/queries";
import { AnnouncementDisplayInfo, AnnouncementData } from "../../../../types/AnnouncementTypes";

const getRoomString = (rooms: number[]) => {
    return rooms.map(room => `Room ${room}`).join(", ");
}

const AnnouncementCard: React.FC<{announcement: AnnouncementDisplayInfo}> = ({announcement}) => {
    const formatDate = (date: Date) => {
        return date.toLocaleString("en-ca", {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).toLowerCase();
    };

    return (
        <Flex
        flexDir="column"
        width="100%"
        bg="neutral.100"
        border="1px solid"
        borderColor="neutral.300"
        rounded="8px"
        paddingX="12px"
        paddingY="7px"
        gap="5px"
        >
        <Flex
            width="100%"
            alignItems="baseline"
        >
            <Text textStyle="web.b1" color="black">
                {getRoomString(announcement.rooms)}
            </Text>
            <Text textStyle="web.b3" color="text.light.secondary" marginLeft="20px">
                posted at {formatDate(announcement.creation_date)}
            </Text>
        </Flex>
        <Flex width="100%">
            <Text textStyle="web.b2" color="black">{announcement.message}</Text>
        </Flex>
        </Flex>
    );
};

const AnnouncementSection = () => {
  const {
    loading: getAnnouncementsLoading,
    error: getAnnouncementsError,
    data: getAnnouncementsData,
  } = useQuery(GET_ANNOUNCEMENTS_IN_DATE_RANGE, {
    variables: {
      start: new Date(new Date().setHours(0,0,0,0)).toISOString(),
      end: new Date(new Date().setHours(23,59,59,999)).toISOString(),
  },
  }) 

  console.log(getAnnouncementsData)

  // Get the display info for the announcements
  const data: AnnouncementDisplayInfo[] = getAnnouncementsData?.getAnnouncementsInDateRange?.map((announcement: AnnouncementData) => ({
    announcement_id: announcement.announcement_id,
    rooms: announcement.user_announcements.map(ua => ua.participant.room_number).sort((a, b) => a - b),
    creation_date: new Date(announcement.creation_date),
    message: announcement.message,
  })) || [];

  return (
    <Flex
      height="100%"
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      flexDir="column"
      justifyContent="space-between"
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
            {data.length} new post{data.length === 1 ? "" : "s"} today
          </Text>
        </Flex>
        <Link 
          as={RouterLink} 
          to="/admin/announcements"
          textStyle="web.b2" 
          fontFamily="Nunito"
          color="black"
          textDecoration="underline"
        >
          View All
        </Link>
      </Flex>
      <Flex
        alignItems="center"
        overflow="scroll"
        height="82.5%"
        justifyContent="center"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        { getAnnouncementsLoading ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            Loading...
          </Text>
        ) : getAnnouncementsError ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            {getAnnouncementsError?.message || "An error occurred"}
          </Text>
        ) : (
          data.length === 0 ? (
            <Text textStyle="web.b2" color="text.light.secondary">
              No Announcements Yet
            </Text>
          ) : (
            <Flex
              width="100%"
              height="100%"
              flexDir="column"
              justifyContent="flex-start"
              gap="15px"
            >
              {data.map((announcement: AnnouncementDisplayInfo) => {
                return <AnnouncementCard key={announcement.announcement_id} announcement={announcement} />
              })}
            </Flex>
          )
        )}
      </Flex>
    </Flex>
  );
}

export default AnnouncementSection;
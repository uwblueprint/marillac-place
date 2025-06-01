import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_ANNOUNCEMENTS } from "../../../../gql/queries";
import { Announcement } from "../../../../types/AnnouncementTypes";

const getRoomString = (rooms: number[]) => {
    return rooms.map(room => `Room ${room}`).join(", ");
}

const AnnouncementCard: React.FC<{announcement: Announcement}> = ({announcement}) => {
    // Format the date to match the "posted at 1:00 pm" format
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
            justifyContent="space-between"
            alignItems="center"
        >
            <Text textStyle="web.b3" color="text.light.secondary">
                {getRoomString(announcement.rooms)}
            </Text>
            <Text textStyle="web.b3" color="text.light.secondary">
                posted at {formatDate(announcement.creation_date)}
            </Text>
        </Flex>
        <Flex width="100%">
            <Text textStyle="web.b2" color="#000000">{announcement.message}</Text>
        </Flex>
        </Flex>
    );
};

const AnnouncementSection = () => {
  /* const {
    loading: getAnnouncementsLoading,
    error: getAnnouncementsError,
    data: getAnnouncementsData,
  } = useQuery(GET_ANNOUNCEMENTS_IN_DATE_RANGE, {
    variables: {
    start: new Date("2025-06-01T12:00:00.000Z").toISOString(),
    end: new Date("2025-06-01T12:00:00.000Z").toISOString(),
  },
  }) 
  */

  const error = null as {message: string} | null;
  const loading = false;

  const testAnnouncements: Announcement[] = [
    {
      rooms: [1, 2, 3],
      creation_date: new Date(),
      message: "Test Announcement",
    },
    {
      rooms: [4, 5, 6],
      creation_date: new Date(),
      message: "Test Announcement 2",
    },
  ];

  const data = testAnnouncements;

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
        <Text textStyle="web.h3" color="primary.700">
            Announcements
        </Text>
        <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
          Expires in 48h
        </Text>
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
        { loading ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            Loading...
          </Text>
        ) : error ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            {error?.message || "An error occurred"}
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
              {data.map((announcement: Announcement, index: number) => {
                // For now, we'll use a placeholder for rooms since the backend doesn't provide room mapping
                // You'll need to either modify the backend to include room info or create a separate query
                const announcementWithRoomsAndDate = {
                  ...announcement,
                  rooms: [1, 2], // Placeholder - needs to be derived from user_announcements -> participants -> rooms
                  creation_date: announcement.creation_date instanceof Date 
                    ? announcement.creation_date 
                    : new Date(announcement.creation_date)
                };
                return <AnnouncementCard key={`${announcement.message}-${index}`} announcement={announcementWithRoomsAndDate} />
              })}
            </Flex>
          )
        )}
      </Flex>
    </Flex>
  );
}

export default AnnouncementSection;
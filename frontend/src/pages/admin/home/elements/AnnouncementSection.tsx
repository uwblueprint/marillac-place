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
import { GET_ANNOUNCEMENTS_IN_DATE_RANGE } from "../../../../gql/queries";
import { Announcement } from "../../../../types/AnnouncementTypes";

const getRoomString = (rooms: number[]) => {
    return rooms.map(room => `Room ${room}`).join(", ");
}

const AnnouncementCard = ({announcement}: {announcement: Announcement}) => {
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
            flexWrap="wrap"
            overflow="hidden"
        >
            <Text textStyle="web.b3" color="text.light.secondary">
            {getRoomString(announcement.rooms)}
            </Text>
            <Text textStyle="web.b3" color="text.light.secondary">
            {announcement.creation_date.toLocaleString("en-ca", {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                month: 'short',
                day: 'numeric',
            })}
            </Text>
        </Flex>
        <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="flex-end"
        >
            <Text textStyle="web.b2" color="#000000">{announcement.message}</Text>
        </Flex>
        </Flex>
    );
};

const AnnouncementSection = () => {
  const {
    loading: getAnnouncementsLoading,
    error: getAnnouncementsError,
    data: getAnnouncementsData,
  } = useQuery(GET_ANNOUNCEMENTS_IN_DATE_RANGE) 

  console.log(getAnnouncementsData);

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

  return (
    <Flex
      right={0}
      top={0}
      height="100%"
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      flexDir="column"
      justifyContent="space-between"
    >
      <>
      {{/* Title Row */}}
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
        { getAnnouncementsLoading ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            Loading...
          </Text>
        ) : getAnnouncementsError ? (
          <Text textStyle="web.b2" color="text.light.secondary">
            {getAnnouncementsError.message}
          </Text>
        ) : (
          getAnnouncementsData.getAnnouncements.length === 0 ? (
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
              {getAnnouncementsData.getAnnouncements.map((announcement: any) => {
                return <AnnouncementCard key={announcement.announcement_id} announcement={announcement} />
              })}
            </Flex>
          )
        )}
      </Flex>
      </>
    </Flex>
  );
}

export default AnnouncementSection;
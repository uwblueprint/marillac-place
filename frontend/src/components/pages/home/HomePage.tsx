import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { announcementsMockData } from "../../../mocks/notifications";
import AnnouncementNotification from "./AnnouncementNotification";
import { Announcement } from "../../../types/NotificationTypes";
import RoomGrid from "./RoomGrid";

const HomePage = (): React.ReactElement => {
  const [numberPosts, setNumberPosts] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<
    Announcement[]
  >([]);

  useEffect(() => {
    // Combine all announcements into a single array
    const combinedAnnouncements: Announcement[] = [];
    Object.entries(announcementsMockData).forEach(([key, value]) => {
      for (let i = 0; i < value.length; i += 1) {
        const newAnnouncement: Announcement = {
          room: key,
          author: value[i].author,
          message: value[i].message,
          createdAt: value[i].createdAt,
        };
        combinedAnnouncements.push(newAnnouncement);
      }
    });

    const sortedAnnouncements = combinedAnnouncements.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    // Filter announcements from the current week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeeksAnnouncements = sortedAnnouncements.filter(
      (announcement) => new Date(announcement.createdAt) >= oneWeekAgo,
    );
    setAnnouncements(combinedAnnouncements);
    setRecentAnnouncements(thisWeeksAnnouncements.slice(0, 3));
    setNumberPosts(thisWeeksAnnouncements.length);
  }, []);

  const getDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      overflow="scroll"
      position="relative"
      width="100%"
    >
      <Box
        w="100%"
        h="150px"
        borderWidth={0}
        bg="purple.50"
        position="absolute"
        zIndex="-1"
        top="0"
      />
      <Flex
        flexDir="column"
        w="75%"
        flexGrow={1}
        top="2%"
        justifyContent="center"
      >
        <Flex
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop="24px"
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="left"
            alignItems="center"
            paddingY="8px"
          >
            Marillac Place Overview
          </Text>

          <Text
            fontSize="xl"
            fontWeight="bold"
            textAlign="left"
            alignItems="center"
            paddingY="8px"
            color="#382584"
          >
            {getDate()}
          </Text>
        </Flex>
        <RoomGrid />
        <Box
          border="2px solid #E3E4EA"
          p={6}
          justifyContent="space-between"
          borderRadius="8px"
          marginTop="36px"
          marginBottom="36px"
          w="100%"
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Flex alignItems="baseline">
              <Text fontSize="md" as="b">
                Announcements
              </Text>
              <Text ml={6} fontSize="smaller">
                {numberPosts === 0
                  ? "You're all caught up!"
                  : `${numberPosts} new posts today`}
              </Text>
            </Flex>

            <Text
              onClick={() => setViewAll(!viewAll)}
              cursor="pointer"
              textDecoration="underline"
            >
              {viewAll ? "Collapse All" : "View all"}
            </Text>
          </Flex>
          {(viewAll ? announcements : recentAnnouncements).map(
            (announcement, index) => (
              <AnnouncementNotification
                room={announcement.room}
                author={announcement.author}
                message={announcement.message}
                createdAt={announcement.createdAt}
                key={index}
              />
            ),
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;

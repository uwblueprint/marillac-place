import React, { useState, useEffect } from "react";
import { Flex, Box, Heading, Text } from "@chakra-ui/react";
import { announcementsMockData } from "../../../mocks/notifications";
import AnnouncementNotification from "./AnnouncementNotification";
import { Announcement } from "../../../types/NotificationTypes";

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

  return (
    <Flex flexDirection="column" alignItems="center" w="80vw">
      <Box>
        <Heading>Home Page</Heading>
      </Box>
      <Box
        border="2px solid grey"
        p={6}
        justifyContent="space-between"
        borderRadius="8px"
        w="75%"
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

          <Text onClick={() => setViewAll(!viewAll)} cursor="pointer">
            {viewAll ? "View less" : "View all"}
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
  );
};

export default HomePage;

import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Icon, 
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { announcementsMockData } from "../../../mocks/notifications";
import AnnouncementNotification from "./AnnouncementNotification";
import { Announcement } from "../../../types/NotificationTypes";

const HomePage = (): React.ReactElement => {
  const [numberPosts, setNumberPosts] = useState(0);
  const [viewAll, setViewAll] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    // Combine all announcements into a single array
    // let combinedAnnouncements: Announcement[] = [];
    // const announcementKeys: Array<keyof typeof announcementsMockData> =
    //   Object.keys(announcementsMockData);
    const combinedAnnouncements = Object.values(announcementsMockData).flat();

    // Sort the announcements by createdAt in descending order
    const sortedAnnouncements = combinedAnnouncements.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // // Filter announcements from the current week
    // const oneWeekAgo = new Date();
    // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    // const thisWeeksAnnouncements = sortedAnnouncements.filter(
    //   (announcement) => new Date(announcement.createdAt) >= oneWeekAgo
    // );
    const thisWeeksAnnouncements = sortedAnnouncements

    setAnnouncements(thisWeeksAnnouncements);
    setRecentAnnouncements(thisWeeksAnnouncements.slice(0, 3));
    setNumberPosts(thisWeeksAnnouncements.length);
  }, []);



  return (
    <Flex flexDirection="column" alignItems="center" w="100%">
      <Box>
        <Heading>Home Page</Heading>
      </Box>
      <Box
        border="2px solid grey"
        p="4"
        justifyContent="space-between"
        borderRadius="8px"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Flex alignItems="center">
            <Text fontSize="md" as="b">
              Announcements
            </Text>
            <Text ml={4}>
              {numberPosts === 0
                ? "You're all caught up!"
                : `${numberPosts} new posts today`}
            </Text>
          </Flex>
        
        <Text
          onClick={() => setViewAll(!viewAll)}
          color="blue.500"
          cursor="pointer"
        >
          {viewAll ? "View less" : "View all"}
          </Text>
        </Flex>
          {(viewAll ? announcements : recentAnnouncements).map((announcement, index) => (
          <AnnouncementNotification
            author={announcement.author}
            message={announcement.message}
            createdAt={announcement.createdAt}
            key={index}
          />
        ))}
      </Box>
    </Flex>
  );
};

export default HomePage;

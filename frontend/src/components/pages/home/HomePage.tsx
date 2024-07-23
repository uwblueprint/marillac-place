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

    setAnnouncements(sortedAnnouncements);
    setNumberPosts(sortedAnnouncements.length);
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
        <Box>
          <Text fontSize="md" as="b">
            Announcements
          </Text>
          <Text>
            {numberPosts === 0
              ? "You're all caught up!"
              : `${numberPosts} new posts today`}
          </Text>
        </Box>
        <Text onClick={() => setViewAll(!viewAll)}>View all</Text>
        {announcements.map((announcement, index) => (
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

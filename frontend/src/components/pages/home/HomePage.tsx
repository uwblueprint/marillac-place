import React, { useState, useEffect } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import SideBar from "../../common/SideBar";
import AnnouncementSection from "./AnnouncementSection";
import RoomSection from "./RoomSection";
import NoteSection from "./NoteSection";
// import { announcementsMockData } from "../../../mocks/notifications";
// import AnnouncementNotification from "./AnnouncementsCard";
// import { Announcement } from "../../../types/NotificationType";
// import RoomGrid from "./RoomGrid";

const HomePage = (): React.ReactElement => {
//   const [numberPosts, setNumberPosts] = useState(0);
//   const [viewAll, setViewAll] = useState(false);
//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
//   const [recentAnnouncements, setRecentAnnouncements] = useState<
//     Announcement[]
//   >([]);

//   useEffect(() => {
//     // Combine all announcements into a single array
//     const combinedAnnouncements: Announcement[] = [];
//     Object.entries(announcementsMockData).forEach(([key, value]) => {
//       for (let i = 0; i < value.length; i += 1) {
//         const newAnnouncement: Announcement = {
//           room: key,
//           author: value[i].author,
//           message: value[i].message,
//           createdAt: value[i].createdAt,
//         };
//         combinedAnnouncements.push(newAnnouncement);
//       }
//     });

//     const sortedAnnouncements = combinedAnnouncements.sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
//     );
//     // Filter announcements from the current week
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
//     const thisWeeksAnnouncements = sortedAnnouncements.filter(
//       (announcement) => new Date(announcement.createdAt) >= oneWeekAgo,
//     );
//     setAnnouncements(combinedAnnouncements);
//     setRecentAnnouncements(thisWeeksAnnouncements.slice(0, 3));
//     setNumberPosts(thisWeeksAnnouncements.length);
//   }, []);

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
        w="100vw"
        h="100vh"
    >
        <SideBar />
        <Flex
            w="100%"
            h="100%"
            flexDir="column"
        >
            {/* Header */}
            <Flex
                w="100%"
                h="12%"
                bg="#E3ECEB"
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
                paddingX="40px"
            >
                <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    color="gray.900"
                    marginTop="16px"
                >
                    Marillac Place Overview
                </Text>

                <Text
                    fontSize="l"
                    fontWeight="bold"
                    color="gray.900"
                    marginTop="16px"
                >
                    {getDate()}
                </Text>
            </Flex>
            {/* Main Section */}
            <Flex
                w="100%"
                h="88%"
                padding="10px"
                bg="white"
            >
                <Flex
                    flexGrow={1}
                    flexDir="column"
                >
                    <RoomSection />
                    <AnnouncementSection />
                </Flex>
                <NoteSection />
            </Flex>
        </Flex>
    </Flex>
  );
};
            // {/* <RoomGrid /> */}
            // {/* <Box
            // border="2px solid #E3E4EA"
            // p={6}
            // justifyContent="space-between"
            // borderRadius="8px"
            // marginTop="36px"
            // marginBottom="36px"
            // w="100%"
            // >
            // <Flex justifyContent="space-between" alignItems="center" mb={2}>
            //     <Flex alignItems="baseline">
            //     <Text fontSize="md" as="b">
            //         Announcements
            //     </Text>
            //     <Text ml={6} fontSize="smaller">
            //         {numberPosts === 0
            //         ? "You're all caught up!"
            //         : `${numberPosts} new posts today`}
            //     </Text>
            //     </Flex>

            //     <Text
            //     onClick={() => setViewAll(!viewAll)}
            //     cursor="pointer"
            //     textDecoration="underline"
            //     >
            //     {viewAll ? "Collapse All" : "View all"}
            //     </Text>
            // </Flex>
            // {(viewAll ? announcements : recentAnnouncements).map(
            //     (announcement, index) => (
            //     <AnnouncementNotification
            //         room={announcement.room}
            //         author={announcement.author}
            //         message={announcement.message}
            //         createdAt={announcement.createdAt}
            //         key={index}
            //     />
            //     ),
            // )}
            // </Box> */}

export default HomePage;

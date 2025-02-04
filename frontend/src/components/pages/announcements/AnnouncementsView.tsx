export {}
// import React, { useState } from "react";
// import moment from "moment";
// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   IconButton,
//   Avatar,
//   Heading,
//   Input,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   Tag,
//   HStack,
//   TagLabel,
//   TagCloseButton,
// } from "@chakra-ui/react";
// import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
// import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// import { useMutation } from "@apollo/client";
// import { GroupAnnouncements } from "../../../types/NotificationTypes";
// import { formatRooms } from "./AnnouncementsGroups";
// import {
//   NotificationCreateRequest,
//   NotificationGroupResponse,
// } from "../../../APIClients/Types/NotificationType";
// import { SEND_NOTIFICATION_TO_GROUP } from "../../../APIClients/Mutations/NotificationMutations";

// const MessageInput = ({
//   handlePost,
// }: {
//   handlePost: (message: string) => void;
// }) => {
//   const [message, setMessage] = useState("");

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (message.trim() !== "") {
//       handlePost(message);
//       setMessage("");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <Flex flexDir="row" justifyContent="flex-end" alignItems="flex-end">
//         <Input
//           placeholder="Type an announcement..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           w="100%"
//           mr={4}
//         />
//         <Button
//           w="120px"
//           color="white"
//           backgroundColor="purple.main"
//           type="submit"
//         >
//           Post
//         </Button>
//       </Flex>
//     </form>
//   );
// };

// type Props = {
//   announcements: NotificationGroupResponse[];
//   selectedGroup: string;
//   addingNewRoom: boolean;
//   setAddingNewRoom: React.Dispatch<React.SetStateAction<boolean>>;
//   selectedRooms: number[];
//   setSelectedRooms: React.Dispatch<React.SetStateAction<number[]>>;
//   sendNotification: (message: string, groupId: string) => Promise<void>;
//   createNotificationGroupAndSendNotification: (
//     selectedRooms: number[],
//     message: string,
//   ) => Promise<void>;
// };

// type PropsList = {
//   announcements: NotificationGroupResponse[];
//   selectedGroup: string;
// };

// const AnnouncementsList = ({ announcements, selectedGroup }: PropsList) => {
//   console.log(announcements, selectedGroup);
//   if (selectedGroup.length === 0) {
//     return <></>;
//   }

//   return (
//     <Box>
//       {announcements
//         .filter((group) => group.id === selectedGroup)[0]
//         .notifications?.map((notification, index) => (
//           <Box
//             key={index}
//             backgroundColor="gray.100"
//             p="10px"
//             ml="30px"
//             mr="20px"
//             mt="20px"
//             borderRadius="10px"
//             w="83vh"
//           >
//             <Flex pl={2} align="center">
//               <Avatar
//                 name={notification.authorId || ""}
//                 src="https://bit.ly/2k1H1t6"
//               />
//               <Flex flexDir="column" ml={4}>
//                 <Heading size="sm" fontSize="16px" mt={4} mb={0}>
//                   {notification.authorId || ""}
//                 </Heading>
//                 <Text color="gray.main" fontSize="12px">
//                   {moment(notification.createdAt).fromNow()}
//                 </Text>
//               </Flex>
//             </Flex>
//             <Text pl={2} fontSize="16px">
//               {notification.message}
//             </Text>
//           </Box>
//         ))}
//     </Box>
//   );
// };

// const AnnouncementsView = ({
//   announcements,
//   selectedGroup,
//   addingNewRoom,
//   setAddingNewRoom,
//   selectedRooms,
//   setSelectedRooms,
//   sendNotification,
//   createNotificationGroupAndSendNotification,
// }: Props): React.ReactElement => {
//   const groupInfo = announcements.find((group) => group.id === selectedGroup);
//   const rooms =
//     groupInfo && groupInfo.recipients
//       ? groupInfo.recipients.map((recipient) => recipient.roomNumber)
//       : [];
//   const [allRooms, setAllRooms] = useState([1, 2, 3, 4, 5, 6]);

//   const addRoomToNewRoom = (roomId: number) => {
//     if (!selectedRooms.includes(roomId)) {
//       setSelectedRooms([...selectedRooms, roomId]);
//     }
//   };

//   const deleteRoomSelected = (roomId: number) => {
//     if (selectedRooms.includes(roomId)) {
//       setSelectedRooms(selectedRooms.filter((room) => room !== roomId));
//     }
//   };

//   const handlePost = async (message: string) => {
//     if (addingNewRoom && selectedRooms.length > 0) {
//       await createNotificationGroupAndSendNotification(selectedRooms, message);
//       setSelectedRooms([]);
//       setAddingNewRoom(false);
//       return;
//     }
//     await sendNotification(message, selectedGroup);
//   };

//   const formatHeader = (roomIDs: number[]) => {
//     if (addingNewRoom && selectedGroup === "0") {
//       return (
//         <Flex fontSize="16px">
//           <HStack spacing={4}>
//             {selectedRooms.map((room) => (
//               <Tag
//                 key={room}
//                 variant="solid"
//                 height="30px"
//                 color="#57469D"
//                 border="1px solid #57469D"
//                 backgroundColor="#F9F7FF"
//               >
//                 <TagLabel textAlign="center">
//                   {" "}
//                   {room === -1 ? "All Rooms" : `Room ${room}`}
//                 </TagLabel>
//                 <TagCloseButton
//                   onClick={() => deleteRoomSelected(room)}
//                   color="#57469D"
//                 />
//               </Tag>
//             ))}
//             {selectedRooms.length === 0 && (
//               <Menu>
//                 <MenuButton>
//                   <AddCircleOutlineOutlinedIcon sx={{ color: "#57469D" }} />
//                 </MenuButton>
//                 <MenuList maxH="40vh" overflow="auto">
//                   {[
//                     <MenuItem
//                       onClick={() => addRoomToNewRoom(-1)}
//                       key="all-rooms"
//                     >
//                       All Rooms
//                     </MenuItem>,
//                     ...allRooms
//                       .filter((room) => !selectedRooms.includes(room))
//                       .map((room) => (
//                         <MenuItem
//                           onClick={() => addRoomToNewRoom(room)}
//                           key={room}
//                         >
//                           Room {room}
//                         </MenuItem>
//                       )),
//                   ]}
//                 </MenuList>
//               </Menu>
//             )}
//           </HStack>
//         </Flex>
//       );
//     }
//     return "All Rooms";
//   };

//   const getHeader = () => {
//     if (selectedGroup === "" || selectedGroup === "0") {
//       return formatHeader(rooms);
//     }
//     if (groupInfo?.announcementGroup) {
//       return "All Rooms";
//     }
//     return formatRooms(rooms);
//   };

//   return (
//     <Box h="100vh" w="100%">
//       <Flex align="left" flexDir="column" h="100%">
//         <Box
//           p="22px 47px"
//           borderBottom="solid"
//           borderBottomColor="gray.300"
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           h="10vh"
//         >
//           <h1 style={{ fontSize: "24px", margin: "0" }}>{getHeader()}</h1>
//           <IconButton
//             aria-label="info"
//             color="purple.main"
//             backgroundColor="white"
//             borderRadius="50%"
//             fontSize="30px"
//           >
//             <InfoOutlinedIcon fontSize="inherit" />
//           </IconButton>
//         </Box>
//         <Box flex={1} h="100vh" overflowY="scroll">
//           {selectedGroup !== "0" && (
//             <AnnouncementsList
//               announcements={announcements || []}
//               selectedGroup={selectedGroup}
//             />
//           )}
//         </Box>
//         <Box p="27px 39px">
//           <MessageInput handlePost={handlePost} />
//         </Box>
//       </Flex>
//     </Box>
//   );
// };

// export default AnnouncementsView;

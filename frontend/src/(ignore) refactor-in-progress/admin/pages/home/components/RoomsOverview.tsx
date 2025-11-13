// TODO: Refactor in progress - ignore for now
// import { Flex, Text, Grid, Link } from "@chakra-ui/react";
// import { useLazyQuery } from "@apollo/client";
// import React, { useEffect, useState } from "react";
// import { GET_PARTICIPANT_BY_ROOM } from "../../../../gql/example";
// import { ROOM_NUMBERS } from "../../../../../constants/rooms";
//
// type RoomData = {
//   roomNumber: number;
//   participantId: number;
//   taskAssigned: number;
// };
//
// enum Status {
//   PENDING_APPROVAL = "PENDING_APPROVAL",
//   ASSIGNED = "ASSIGNED",
//   INCOMPLETE = "INCOMPLETE",
//   COMPLETE = "COMPLETE",
//   EXCUSED = "EXCUSED",
// }
//
// export default function RoomsOverview() {
//   const [roomData, setRoomData] = useState<RoomData[]>([]);
//   const [getRoomData, { loading, error }] = useLazyQuery(
//     GET_PARTICIPANT_BY_ROOM
//   );
//
//   const handleViewSchedule = (roomNumber: number) => {
//     localStorage.setItem("scheduleSelectedRoom", roomNumber.toString());
//   };
//
//   useEffect(() => {
//     const fetchAllRooms = async () => {
//       const results: RoomData[] = await Promise.all(
//         ROOM_NUMBERS.map(async (roomNumber) => {
//           const { data } = await getRoomData({
//             variables: { room_number: roomNumber },
//           });
//
//           return {
//             roomNumber,
//             participantId: data?.getParticipantByRoom?.participant_id || null,
//             taskAssigned:
//               data?.getParticipantByRoom?.assigned_tasks?.filter(
//                 (task: any) =>
//                   task.task_status === Status.ASSIGNED ||
//                   task.task_status === Status.INCOMPLETE
//               ).length || 0,
//           };
//         })
//       );
//
//       setRoomData(results);
//     };
//
//     fetchAllRooms();
//   }, [getRoomData]);
//
//   return (
//     <Flex
//       paddingY="15px"
//       paddingX="20px"
//       border="1px solid"
//       borderColor="neutral.300"
//       borderRadius="8px"
//       height="320px"
//       marginRight="10px"
//       marginBottom="10px"
//       flexDir="column"
//       gap="10px"
//       justifyContent="flex-start"
//     >
//       <Flex
//         w="100%"
//         flexDir="row"
//         justifyContent="flex-start"
//         alignItems="center"
//         px="2px"
//         gap="20px"
//       >
//         <Text textStyle="web.h3" color="primary.700">
//           Rooms
//         </Text>
//         <Text textStyle="web.b3" color="text.light.secondary" mt="5px">
//           Showing pending tasks for today
//         </Text>
//       </Flex>
//       <Flex
//         h="100%"
//         overflow="scroll"
//         justifyContent="center"
//         sx={{
//           "&::-webkit-scrollbar": {
//             display: "none",
//           },
//         }}
//       >
//         {loading ? (
//           <Text textStyle="web.b2" color="text.light.secondary">
//             Loading...
//           </Text>
//         ) : error ? (
//           <Text textStyle="web.b2" color="text.light.secondary">
//             {error?.message || "An error occured."}
//           </Text>
//         ) : (
//           <Grid w="100%" h="100%" templateColumns="repeat(5, 1fr)" gap="10px">
//             {roomData.map((room: RoomData) => (
//               <Flex
//                 key={room.roomNumber}
//                 border="1px solid"
//                 borderColor="neutral.300"
//                 borderRadius="8px"
//                 flexDir="column"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 paddingBottom="10px"
//                 gap="5px"
//               >
//                 <Text
//                   textStyle="web.s1"
//                   bg="primary.100"
//                   width="100%"
//                   textAlign="center"
//                   padding="8px"
//                   borderBottom="1px solid"
//                   borderColor="neutral.300"
//                   borderTopRightRadius="8px"
//                   borderTopLeftRadius="8px"
//                 >
//                   Room {room.roomNumber}
//                 </Text>
//
//                 {room.participantId ? (
//                   <>
//                     <Text textStyle="web.b3" textAlign="center">
//                       ID Number:{" "}
//                       <Text as="span" textStyle="web.s1">
//                         #{room.participantId}
//                       </Text>
//                     </Text>
//                     <Text textStyle="web.b3" textAlign="center">
//                       {room.taskAssigned} Assigned Tasks
//                     </Text>
//                     <Link
//                       onClick={() => handleViewSchedule(room.roomNumber)}
//                       href="/admin/schedule"
//                       textDecoration="underline"
//                       textAlign="center"
//                       textStyle="web.b3"
//                       fontFamily="Nunito"
//                       fontWeight={600}
//                       color="black"
//                       _hover={{
//                         textDecoration: "none",
//                       }}
//                     >
//                       View Schedule
//                     </Link>
//                   </>
//                 ) : (
//                   <>
//                     <Text textStyle="web.b3" textAlign="center">
//                       Room Available.
//                     </Text>
//                     <Link
//                       href="/admin/participants"
//                       textDecoration="underline"
//                       textAlign="center"
//                       textStyle="web.b3"
//                       fontFamily="Nunito"
//                       fontWeight={600}
//                       color="black"
//                       _hover={{
//                         textDecoration: "none",
//                       }}
//                     >
//                       View Participants
//                     </Link>
//                   </>
//                 )}
//               </Flex>
//             ))}
//           </Grid>
//         )}
//       </Flex>
//     </Flex>
//   );
// }

// Refactor in progress - ignore for now
// import React, { useContext } from "react";
// import { Flex, Text } from "@chakra-ui/react";
// import { useQuery } from "@apollo/client";
// import { ParticipantContext } from "../../../../../participants/ParticipantContext";
// import TasksCompletedWidget from "./TasksCompletedWidget";
// import { HAS_COMPLETED_ALL_REQUIRED_TASKS } from "../../../../gql/example";
// import BadgeRow from "./BadgeRow";
// import { BadgeRarity } from "../../../common/Badge";
//
// export default function HomeContent() {
//   const participant = useContext(ParticipantContext);
//   const participantId = participant?.id;
//
//   // Get current date
//   const currentDate = new Date();
//   const dayNames = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//
//   const dayName = dayNames[currentDate.getDay()];
//   const monthName = monthNames[currentDate.getMonth()];
//   const date = currentDate.getDate();
//   const year = currentDate.getFullYear();
//
//   const formattedDate = `${dayName} - ${monthName} ${date}, ${year}`;
//
//   // Query to check if participant has completed all required tasks
//   const { data: tasksData, loading: tasksLoading } = useQuery(
//     HAS_COMPLETED_ALL_REQUIRED_TASKS,
//     {
//       variables: { participantId },
//       skip: !participantId,
//     }
//   );
//
//   const hasCompletedAllTasks = tasksData?.hasCompletedAllRequiredTasks || false;
//
//   const badge = {
//     icon: "heart",
//     rarity: "silver" as BadgeRarity,
//     percentComplete: 20,
//   };
//
//   return (
//     <Flex w="100%" flexDir="column" gap="16px" padding="20px">
//       {/* Welcome Section */}
//       <Flex w="100%" flexDir="column" gap="4px">
//         <Text
//           fontFamily="Nunito"
//           fontWeight="700"
//           fontSize="24px"
//           color="primary.700"
//         >
//           Welcome to Marillac Place
//         </Text>
//         <Text
//           fontFamily="Nunito"
//           fontWeight="400"
//           fontSize="16px"
//           color="text.light.secondary"
//         >
//           {formattedDate}
//         </Text>
//       </Flex>
//
//       {/* Tasks Completed Widget - Only show if all required tasks are completed */}
//       {!tasksLoading && hasCompletedAllTasks && <TasksCompletedWidget />}
//       <Flex
//         w="100%"
//         bg="white"
//         border="1px solid"
//         borderColor="neutral.300"
//         borderRadius="8px"
//         padding="16px"
//         flexDir="column"
//         gap="12px"
//       >
//         <BadgeRow
//           messageText="this is message text"
//           subtitle="this is subtitle"
//           title="this is title"
//           badge={badge}
//         />
//       </Flex>
//     </Flex>
//   );
// }

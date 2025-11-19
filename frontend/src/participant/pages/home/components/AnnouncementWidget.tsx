export {};
// TODO: Refactor this component
// import React, { useContext } from "react";
// import { Divider, Flex, Text } from "@chakra-ui/react";
// import { useQuery } from "@apollo/client";
// import { useNavigate } from "react-router-dom";
// import WidgetContainer from "../../../common/WidgetContainer";
// import { GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID } from "../../../../gql/queries";
// import { displayDate2 } from "../../../../utils/formatDateTime";
// import { ParticipantContext } from "../../../common/ParticipantContext";
// import * as ROUTES from "../../../../constants/routes";
// 
// export default function AnnouncementWidget() {
//   const participant = useContext(ParticipantContext);
//   const participantId = participant?.id ?? "";
//   const navigate = useNavigate();
// 
//   const {
//     data: announcementData,
//     loading: announcementLoading,
//     error: announcementError,
//   } = useQuery(GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID, {
//     variables: {
//       participant_id: participantId,
//     },
//   });
// 
//   if (announcementLoading) return <Text>Loading announcements.</Text>;
//   if (announcementError) return <Text>Error fetching announcements.</Text>;
// 
//   return (
//     <WidgetContainer>
//       <>
//         <Flex flexDir="row" justifyContent="space-between">
//           <Text textStyle="mobile.h2">Announcements</Text>
//           <Text
//             textStyle="mobile.b2"
//             onClick={() => navigate(ROUTES.PARTICIPANTS_ANNOUNCEMENTS_PAGE)}
//             textDecoration="underline"
//             cursor="pointer"
//           >
//             Announcements
//           </Text>
//         </Flex>
// 
//         {announcementData.getAnnouncementsByParticipantId.map(
//           (announcement: any) => (
//             <Flex
//               width="100%"
//               flexDir="column"
//               gap="6px"
//               key={announcement.announcement_id}
//             >
//               <Divider borderColor="background.border" />
//               <Text paddingTop="4px" textStyle="mobile.b2">
//                 {announcement.announcement.message}
//               </Text>
//               <Text textStyle="mobile.b2" color="text.grey">
//                 {displayDate2(
//                   new Date(announcement.announcement.creation_date)
//                 )}
//               </Text>
//             </Flex>
//           )
//         )}
//       </>
//     </WidgetContainer>
//   );
// }

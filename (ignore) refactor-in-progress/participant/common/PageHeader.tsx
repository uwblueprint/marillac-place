// Refactor in progress - ignore for now
// import { Flex, Text, Image, Spinner } from "@chakra-ui/react";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import React, { useContext, useState } from "react";
// import { useQuery } from "@apollo/client";
// import TaskBar from "./TaskBar";
// import { ParticipantContext } from "../../../participants/ParticipantContext";
// import { GET_MARILLAC_BUCKS } from "../../gql/example";
// import * as ROUTES from "../../constants/routes";
//
// function ParticipantPageHeader() {
//   const pages = [
//     { label: "Home", route: ROUTES.PARTICIPANTS_HOME_PAGE },
//     { label: "Schedule", route: ROUTES.PARTICIPANTS_SCHEDULE_PAGE },
//     { label: "Announcements", route: ROUTES.PARTICIPANTS_ANNOUNCEMENTS_PAGE },
//     { label: "Progress", route: ROUTES.PARTICIPANTS_PROGRESS_PAGE },
//   ];
//
//   const currentPageIndex = pages.findIndex(
//     (page) => page.route === window.location.pathname
//   );
//
//   const participant = useContext(ParticipantContext);
//   const [showTaskBar, setShowTaskBar] = useState(false);
//
//   const participantId = participant?.id ?? "";
//
//   const { loading, error, data } = useQuery(GET_MARILLAC_BUCKS, {
//     variables: { participantId },
//     skip: !participant,
//   });
//
//   if (error) {
//     return <Flex>Something went wrong.</Flex>;
//   }
//
//   if (!participant || loading) {
//     return <Spinner />;
//   }
//
//   return (
//     <Flex
//       width="100%"
//       height="75px"
//       bg="primary.100"
//       padding="20px"
//       alignItems="flex-end"
//       justifyContent="space-between"
//       position="relative"
//     >
//       {!showTaskBar && (
//         <Flex onClick={() => setShowTaskBar(true)} cursor="pointer">
//           <MenuIcon fontSize="medium" />
//         </Flex>
//       )}
//       {showTaskBar && (
//         <>
//           <Flex onClick={() => setShowTaskBar(false)} cursor="pointer">
//             <CloseIcon fontSize="medium" />
//           </Flex>
//           <TaskBar
//             participantId={participant?.id}
//             currentPageIndex={currentPageIndex}
//             pages={pages}
//             closeTaskBar={() => setShowTaskBar(false)}
//           />
//         </>
//       )}
//       <Text textStyle="mobile.h1">{pages[currentPageIndex].label}</Text>
//       <Flex gap="7px" alignItems="center" justifyContent="center">
//         <Image
//           src="/assets/marillac_bucks.png"
//           alt="$"
//           width="25px"
//           height="25px"
//           objectFit="cover"
//           borderRadius="100%"
//         />
//         <Text textStyle="mobile.h2">
//           {data.getParticipantById.marillac_bucks}
//         </Text>
//       </Flex>
//     </Flex>
//   );
// }
//
// export default ParticipantPageHeader;

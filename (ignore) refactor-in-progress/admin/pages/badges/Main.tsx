// Refactor in progress - ignore for now
// import { Flex, Text } from "@chakra-ui/react";
// import { useQuery } from "@apollo/client";
// import React, { useEffect, useState } from "react";
// import CreateCustomBadgeModal from "./components/CreateCustomBadgeModal";
// import CustomBadgeTable from "./components/CustomBadgeTable";
// import SystemBadgeTable from "./components/SystemBadgeTable";
// import { GET_CUSTOM_BADGES, GET_SYSTEM_BADGES } from "../../../gql/example";
// import AssignCustomBadgeModal from "./components/AssignCustomBadgeModal";
// import GreenButton from "../../common/buttons/GreenButton";
// import OrangeButton from "../../common/buttons/OrangeButton";
//
// export default function AdminBadgesPage() {
//   const [create, setCreate] = useState(false);
//   const [assign, setAssign] = useState(false);
//
//   const [customBadges, setCustomBadges] = useState([]);
//   const [systemBadges, setSystemBadges] = useState([]);
//
//   const {
//     loading: customBadgesLoading,
//     error: customBadgesError,
//     data: customBadgesData,
//   } = useQuery(GET_CUSTOM_BADGES);
//
//   const {
//     loading: systemBadgesLoading,
//     error: systemBadgesError,
//     data: systemBadgesData,
//   } = useQuery(GET_SYSTEM_BADGES);
//
//   useEffect(() => {
//     if (!systemBadgesLoading && !systemBadgesError && systemBadgesData) {
//       setSystemBadges(systemBadgesData.getSystemBadges);
//     }
//   }, [systemBadgesLoading, systemBadgesError, systemBadgesData]);
//
//   useEffect(() => {
//     if (!customBadgesLoading && !customBadgesError && customBadgesData) {
//       setCustomBadges(customBadgesData.getCustomBadges);
//     }
//   }, [customBadgesLoading, customBadgesError, customBadgesData]);
//
//   return (
//     <Flex width="100%" height="fit-content" flexDir="column" gap="15px">
//       <Flex
//         width="100%"
//         height="fit-content"
//         alignItems="center"
//         justifyContent="space-between"
//       >
//         <Flex alignItems="center" gap="15px">
//           <Text textStyle="web.h2" color="primary.700">
//             System Badges
//           </Text>
//           <Text textStyle="web.b3" color="text.light.secondary" marginTop="7px">
//             System badges will be granted to participants automatically.
//           </Text>
//         </Flex>
//       </Flex>
//       <SystemBadgeTable
//         loading={systemBadgesLoading}
//         error={systemBadgesError}
//         badges={systemBadges}
//       />
//       <Flex
//         width="100%"
//         height="fit-content"
//         alignItems="center"
//         justifyContent="space-between"
//       >
//         <Flex alignItems="center" gap="15px">
//           <Text textStyle="web.h2" color="primary.700">
//             Custom Badges
//           </Text>
//           <Text textStyle="web.b3" color="text.light.secondary" marginTop="7px">
//             You can create new and reward participants custom badges.
//           </Text>
//         </Flex>
//         <Flex alignItems="center" gap="15px">
//           <GreenButton
//             text="Assign Custom Badge"
//             action={() => setAssign(true)}
//             is_active={assign}
//           />
//           <OrangeButton
//             text="Create New"
//             action={() => setCreate(true)}
//             is_active={create}
//           />
//         </Flex>
//       </Flex>
//       <CustomBadgeTable
//         loading={customBadgesLoading}
//         error={customBadgesError}
//         badges={customBadges}
//       />
//
//       {create && <CreateCustomBadgeModal onClose={() => setCreate(false)} />}
//       {assign && <AssignCustomBadgeModal onClose={() => setAssign(false)} />}
//     </Flex>
//   );
// }

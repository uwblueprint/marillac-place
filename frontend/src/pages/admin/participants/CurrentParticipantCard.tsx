export {}

// import { Button, Flex, Text } from "@chakra-ui/react";
// import React, { useState } from "react";
// import EditParticipantCard from "./EditParticipantCard";
//
// type CurrentParticipantCardProps = {
//   roomNumber: string;
//   participants: Record<string, any>;
// };
//
// const CurrentParticipantCard = ({
//   roomNumber,
//   participants,
// }: CurrentParticipantCardProps) => {
//   const [editParticipant, setEditParticipant] = useState(false);
//   return (
//     <Flex
//       w="19%"
//       h="45%"
//       border="solid"
//       borderColor="neutral.200"
//       borderRadius="5px"
//       flexDir="column"
//       justifyContent="center"
//       alignItems="center"
//       position="relative"
//       pb="1.2%"
//     >
//       <Flex
//         position="absolute"
//         top="0px"
//         w="100%"
//         justifyContent="center"
//         p="1.5%"
//         borderBottom="solid"
//         borderColor="neutral.200"
//         bg="#E3ECEB"
//         fontSize="small"
//         fontWeight="700"
//       >
//         Room {roomNumber}
//       </Flex>
//       <Flex flexDir="column" gap="5px" alignItems="center">
//         <Flex fontSize="xs">
//           ID Number:&nbsp;
//           <span style={{ fontWeight: "bold" }}>
//             {participants[roomNumber].participantId}
//           </span>
//         </Flex>
//         <Flex fontSize="xs">
//           Arrival Date:&nbsp;
//           <span style={{ fontWeight: "bold" }}>
//             {participants[roomNumber].arrival}
//           </span>
//         </Flex>
//       </Flex>
//       <Button
//         position="absolute"
//         bottom="10%"
//         size="xs"
//         fontSize="xs"
//         bg="secondary.500"
//         color="white"
//         onClick={() => setEditParticipant(true)}
//       >
//         Edit Participant
//       </Button>
//       {editParticipant && (
//         <EditParticipantCard
//           selectedRoomNumber={roomNumber}
//           participants={participants}
//           close={() => setEditParticipant(false)}
//         />
//       )}
//     </Flex>
//   );
// };
//
// export default CurrentParticipantCard;

import { Flex, Spinner, Text, Grid } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_PARTICIPANTS } from "../../../gql/queries";
import { ROOM_NUMBERS } from "../../../constants/rooms";
import OccupiedRoomCard from "./elements/OccupiedRoomCard";
import EmptyRoomCard from "./elements/EmptyRoomCard";
import PastParticipantTable from "./elements/PastParticipantTable";

export default function AdminParticipantsPage() {
  const { loading, error, data } = useQuery(GET_CURRENT_PARTICIPANTS);

  const currentParticipants: Record<number, any> = {};
  if (data && data.getCurrentParticipants) {
    data.getCurrentParticipants.forEach((participant: any) => {
      currentParticipants[participant.room_number] = participant;
    });
  }

  return (
    <Flex w="100%" flexDir="column" minHeight="fit-content">
      <Text textStyle="web.h2" color="primary.700" mb="10px">Current Participants</Text>

      { loading ? (
        <Spinner />
      ) : error ? (
        <Flex>{error.message}</Flex>
      ) : (
        <Grid w="100%" templateColumns='repeat(5, 1fr)' gap="15px">
          { ROOM_NUMBERS.map((num) =>
            num in currentParticipants ? (
              <OccupiedRoomCard key={num} roomNumber={num} participants={currentParticipants} />
            ) : (
              <EmptyRoomCard key={num} roomNumber={num} />
            )
          )}
        </Grid>
      )}

      <Text textStyle="web.h2" color="primary.700" mt="20px" mb="10px">Past Participants</Text>
      <PastParticipantTable />
    </Flex>
  )
}
//   const {
//     loading: getPastParticipantsLoading,
//     error: getPastParticipantsError,
//     data: getPastParticipantsData,
//   } = useQuery(GET_PAST_PARTICIPANTS);
//
//   return (
//     <Flex w="100vw" h="100vh">
//       <Flex w="100%" h="100%" flexDir="column">
//         <Flex
//           w="100%"
//           h="100%"
//           paddingY="15px"
//           paddingX="30px"
//           flexDir="column"
//         >
//           <Flex w="100%" h="50%" flexDir="column" paddingTop="50px">
//             <Text fontSize="xl" fontWeight="600" color="#15646E" mb="10px">
//               Current Participants
//             </Text>
//             {getCurrentParticipantsLoading ? (
//               <Spinner />
//             ) : getCurrentParticipantsError ? (
//               <Flex>{getCurrentParticipantsError.message}</Flex>
//             ) : getCurrentParticipantsData?.getCurrentParticipants ? (
//               <Flex
//                 w="100%"
//                 h="100%"
//                 alignItems="top"
//                 justifyContent="space-between"
//                 wrap="wrap"
//               >
//                 {((): any => {
//                   const currentParticipants: Record<string, any> = {};
//                   getCurrentParticipantsData.getCurrentParticipants.forEach(
//                     (participant: any) => {
//                       currentParticipants[participant.roomNumber] = participant;
//                     },
//                   );
//
//                   return roomNumbers.map((num) =>
//                     num in currentParticipants ? (
//                       <CurrentParticipantCard
//                         key={num}
//                         roomNumber={num}
//                         participants={currentParticipants}
//                       />
//                     ) : (
//                       <EmptyParticipantCard key={num} roomNumber={num} />
//                     ),
//                   );
//                 })()}
//               </Flex>
//             ) : (
//               <Flex>An unknown issue has occurred.</Flex>
//             )}
//           </Flex>
//           <Flex w="100%" h="50%" flexDir="column">
//             <Text fontSize="xl" fontWeight="600" color="#15646E" mb="10px">
//               Past Participants
//             </Text>
//             {getPastParticipantsLoading ? (
//               <Spinner />
//             ) : getPastParticipantsError ? (
//               <Flex>{getPastParticipantsError.message}</Flex>
//             ) : getPastParticipantsData.getPastParticipants ? (
//               <CommonTable
//                 data={getPastParticipantsData.getPastParticipants.map(
//                   (participant: TableData) => ({
//                     participantId: participant.participantId,
//                     arrival: participant.arrival,
//                     departure: participant.departure,
//                   }),
//                 )}
//                 columnInfo={columnTypes}
//                 onEdit={(row: any) => {
//                   setSelected(row);
//                   setEditPastParticipant(true);
//                 }}
//                 maxResults={4}
//               />
//             ) : (
//               <Flex>No participants found.</Flex>
//             )}
//             {editPastParticipant && selected && (
//               <EditPastParticipantCard
//                 selected={selected}
//                 close={() => setEditPastParticipant(false)}
//               />
//             )}
//           </Flex>
//         </Flex>
//       </Flex>
//     </Flex>
//   );
// };
//
// export default ParticipantsPage;

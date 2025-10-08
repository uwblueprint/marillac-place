import { Flex, Spinner, Text, Grid } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_PARTICIPANTS } from "../../../gql/queries";
import { ROOM_NUMBERS } from "../../../constants/rooms";
import OccupiedRoomCard from "./components/OccupiedRoomCard";
import EmptyRoomCard from "./components/EmptyRoomCard";
import PastParticipantTable from "./components/PastParticipantTable";

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
      <Text textStyle="web.h2" color="primary.700" mb="10px">
        Current Participants
      </Text>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Flex>{error.message}</Flex>
      ) : (
        <Grid w="100%" templateColumns="repeat(5, 1fr)" gap="15px">
          {ROOM_NUMBERS.map((num) =>
            num in currentParticipants ? (
              <OccupiedRoomCard
                key={num}
                roomNumber={num}
                participants={currentParticipants}
              />
            ) : (
              <EmptyRoomCard key={num} roomNumber={num} />
            )
          )}
        </Grid>
      )}

      <Text textStyle="web.h2" color="primary.700" mt="20px" mb="10px">
        Past Participants
      </Text>
      <PastParticipantTable />
    </Flex>
  );
}

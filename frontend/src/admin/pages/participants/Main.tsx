import { Flex, Spinner, Text, Grid } from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_PARTICIPANTS, GET_PAST_PARTICIPANTS } from "../../../gql/participantRequests";
import { ROOM_NUMBERS } from "../../../constants/rooms";
import OccupiedRoomCard from "./components/OccupiedRoomCard";
import EmptyRoomCard from "./components/EmptyRoomCard";
import PastParticipantTable from "./components/PastParticipantTable";
import LoadingScreen from "../../../ui/screens/LoadingScreen";
import ErrorScreen from "../../../ui/screens/ErrorScreen";
import { Participant } from "../../../types/models";

export default function AdminParticipantsPage() {
  const { loading: loadingCurrent, error: errorCurrent, data: dataCurrent, refetch: refetchCurrent } = useQuery(GET_CURRENT_PARTICIPANTS);
  const { loading: loadingPast, error: errorPast, data: dataPast, refetch: refetchPast } = useQuery(GET_PAST_PARTICIPANTS);

  const currentParticipants: Record<number, Participant> = {};
  if (dataCurrent && dataCurrent.getCurrentParticipants) {
    dataCurrent.getCurrentParticipants.forEach((participant: Participant) => {
      currentParticipants[participant.room] = participant;
    });
  }

  if (loadingCurrent || loadingPast) return <LoadingScreen />;
  if (errorCurrent || errorPast) return <ErrorScreen />;

  return (
    <Flex w="100%" flexDir="column" minHeight="fit-content">
      <Text textStyle="web.h2" color="primary.700" mb="10px">
        Current Participants
      </Text>

      <Grid w="100%" templateColumns="repeat(5, 1fr)" gap="10px">
        {ROOM_NUMBERS.map((num) =>
          num in currentParticipants ? (
            <OccupiedRoomCard
              key={num}
              roomNumber={num}
              participants={currentParticipants}
              refetchCurrent={refetchCurrent}
              refetchPast={refetchPast}
            />
          ) : (
            <EmptyRoomCard key={num} roomNumber={num} refetch={refetchCurrent} />
          )
        )}
      </Grid>

      <Text textStyle="web.h2" color="primary.700" mt="20px" mb="10px">
        Past Participants
      </Text>
      <PastParticipantTable participants={dataPast?.getPastParticipants || []} refetch={refetchPast} loading={loadingPast} error={errorPast} />
    </Flex>
  );
}

import React, { useMemo } from "react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import WidgetContainer from "../../../ui/containers/WidgetContainer";
import { GET_CURRENT_PARTICIPANTS } from "../../../gql/participantRequests";
import { Participant } from "../../../types/models";
import { ROOM_NUMBERS } from "../../../constants/rooms";
import OccupiedRoomCard from "./components/OccupiedRoomCard";
import EmptyRoomCard from "./components/EmptyRoomCard";
import PastParticipantTable from "./components/PastParticipantTable";

type ParticipantByRoom = Record<number, Participant>;

const AdminParticipantsPage = (): React.ReactElement => {
  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery<{ getCurrentParticipants: Participant[] }>(
    GET_CURRENT_PARTICIPANTS,
  );

  const participantsByRoom: ParticipantByRoom = useMemo(() => {
    const mapping: ParticipantByRoom = {};
    data?.getCurrentParticipants.forEach((participant) => {
      const roomNumber = participant.room;
      if (roomNumber !== null && roomNumber !== undefined) {
        mapping[roomNumber] = participant;
      }
    });
    return mapping;
  }, [data]);

  const refreshParticipants = async () => {
    await refetch();
  };

  return (
    <Flex w="100%" flexDir="column" gap="20px" minHeight="fit-content">
      <Text textStyle="web.h2" color="primary.700">
        Current Participants
      </Text>
      <WidgetContainer
        width="100%"
        paddingX="16px"
        paddingY="16px"
        loading={loading}
        error={error?.message}
      >
        <Grid w="100%" templateColumns="repeat(5, minmax(0, 1fr))" gap="15px">
          {ROOM_NUMBERS.map((roomNumber) =>
            participantsByRoom[roomNumber] ? (
              <OccupiedRoomCard
                key={roomNumber}
                roomNumber={roomNumber}
                participant={participantsByRoom[roomNumber]}
                participantsByRoom={participantsByRoom}
                onParticipantsUpdated={refreshParticipants}
              />
            ) : (
              <EmptyRoomCard
                key={roomNumber}
                roomNumber={roomNumber}
                onParticipantsUpdated={refreshParticipants}
              />
            ),
          )}
        </Grid>
      </WidgetContainer>

      <Text textStyle="web.h2" color="primary.700">
        Past Participants
      </Text>
      <PastParticipantTable onParticipantsUpdated={refreshParticipants} />
    </Flex>
  );
};

export default AdminParticipantsPage;

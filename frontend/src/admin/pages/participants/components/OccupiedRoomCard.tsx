import { Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import EditParticipantCard from "./EditParticipantCard";
import OrangeButton from "../../../../ui/buttons/OrangeButton";
import { formatDateV6 } from "../../../../helpers/formatDateTime";
import { Participant } from "../../../../types/models";

type OccupiedRoomCardProps = {
  roomNumber: number;
  participants: Record<number, Participant>;
  refetchCurrent: () => void;
  refetchPast: () => void;
};

const OccupiedRoomCard = ({
  roomNumber,
  participants,
  refetchCurrent,
  refetchPast,
}: OccupiedRoomCardProps) => {
  const [editParticipant, setEditParticipant] = useState(false);
  const id = participants[roomNumber].pid;
  const { arrival } = participants[roomNumber];
  return (
    <Flex
      height="150px"
      border="1px"
      borderColor="background.border"
      borderRadius="8px"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
      gap="5px"
      pb="2px"
    >
      <Flex
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="35px"
        justifyContent="center"
        alignItems="center"
        borderBottom="1px"
        borderColor="background.border"
        bg="brand.primaryLight"
      >
        <Text textStyle="s1">Room {roomNumber}</Text>
      </Flex>

      <Text textStyle="b1">
        ID Number:&nbsp;
        <Text as="span" fontWeight="650">
          #{id}
        </Text>
      </Text>
      <Text textStyle="b1" mb="2px">
        Arrival:&nbsp;
        <Text as="span" fontWeight="650">
          {formatDateV6(new Date(arrival))}
        </Text>
      </Text>

      <Flex position="absolute" bottom="12px">
        <OrangeButton
          label="Edit Participant"
          action={() => setEditParticipant(true)}
          is_active={editParticipant}
        />
      </Flex>

      {editParticipant && (
        <EditParticipantCard
          roomNumber={roomNumber}
          participants={participants}
          close={() => setEditParticipant(false)}
          refetchCurrent={refetchCurrent}
          refetchPast={refetchPast}
        />
      )}
    </Flex>
  );
};

export default OccupiedRoomCard;

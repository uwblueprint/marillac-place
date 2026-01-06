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
      height="140px"
      border="1px"
      borderColor="neutral.300"
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
        borderColor="neutral.300"
        bg="primary.100"
      >
        <Text textStyle="web.s1">Room {roomNumber}</Text>
      </Flex>

      <Text textStyle="web.b3">
        ID Number:&nbsp;
        <Text as="span" fontWeight="700">
          #{id}
        </Text>
      </Text>
      <Text textStyle="web.b3" mb="2px">
        Arrival Date:&nbsp;
        <Text as="span" fontWeight="700">
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

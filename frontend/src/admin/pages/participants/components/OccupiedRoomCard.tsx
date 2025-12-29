import { Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import EditParticipantCard from "./EditParticipantCard";
import OrangeButton from "../../../../ui/buttons/OrangeButton";
import { formatDateMonthDayYear } from "../../../../helpers/formatDateTime";

type OccupiedRoomCardProps = {
  roomNumber: number;
  participants: Record<number, any>;
};

const OccupiedRoomCard = ({
  roomNumber,
  participants,
}: OccupiedRoomCardProps) => {
  const [editParticipant, setEditParticipant] = useState(false);
  const id = participants[roomNumber].pid;
  const { arrival } = participants[roomNumber];
  return (
    <Flex
      height="130px"
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
        h="30px"
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
      <Text textStyle="web.b3">
        Arrival Date:&nbsp;
        <Text as="span" fontWeight="700">
          {formatDateMonthDayYear(new Date(arrival))}
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
        />
      )}
    </Flex>
  );
};

export default OccupiedRoomCard;

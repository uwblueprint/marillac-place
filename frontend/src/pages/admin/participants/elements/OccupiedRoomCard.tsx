import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import EditParticipantCard from "./EditParticipantCard";

type OccupiedRoomCardProps = {
  roomNumber: number;
  participants: Record<number, any>;
};

const OccupiedRoomCard = ({
  roomNumber,
  participants,
}: OccupiedRoomCardProps) => {
  const [editParticipant, setEditParticipant] = useState(false);
  const id = participants[roomNumber].participant_id;
  const arrival = participants[roomNumber].arrival_date

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

      <Text textStyle="web.b3">ID Number:&nbsp;
        <Text as="span" fontWeight="700">#{id}</Text>
      </Text>
      <Text textStyle="web.b3">Arrival Date:&nbsp;
        <Text as="span" fontWeight="700">{arrival}</Text>
      </Text>

      <Button
        position="absolute"
        bottom="12px"
        padding="4px 10px"
        variant="primaryFilled"
        onClick={() => setEditParticipant(true)}
      >
        <Text textStyle="web.s1" color="neutral.0">Edit Participant</Text>
      </Button>

      { editParticipant && (
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

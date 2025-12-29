import { Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import AddParticipantCard from "./AddParticipantCard";
import OrangeButton from "../../../../ui/buttons/OrangeButton";

type EmptyRoomCardProps = {
  roomNumber: number;
};

export default function EmptyRoomCard({ roomNumber }: EmptyRoomCardProps) {
  const [addParticipant, setAddParticipant] = useState(false);
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

      <Text textStyle="web.b3">This room is empty.</Text>

      <Flex position="absolute" bottom="12px">
        <OrangeButton
          label="Add Participant"
          action={() => setAddParticipant(true)}
          is_active={addParticipant}
        />
      </Flex>

      {addParticipant && (
        <AddParticipantCard
          roomNumber={roomNumber}
          close={() => setAddParticipant(false)}
        />
      )}
    </Flex>
  );
}

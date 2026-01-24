import { Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import AddParticipantCard from "./AddParticipantCard";
import OrangeButton from "../../../../ui/buttons/OrangeButton";

type EmptyRoomCardProps = {
  roomNumber: number;
  refetch: () => void;
};

export default function EmptyRoomCard({ roomNumber, refetch }: EmptyRoomCardProps) {
  const [addParticipant, setAddParticipant] = useState(false);
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

      <Text textStyle="b1" mb="2px">This room is empty.</Text>

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
          refetch={refetch}
        />
      )}
    </Flex>
  );
}

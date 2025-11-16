import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import OrangeButton from "../../../../ui/buttons/OrangeButton";
import AddParticipantCard from "./AddParticipantCard";

type EmptyRoomCardProps = {
  roomNumber: number;
  onParticipantsUpdated: () => Promise<void>;
};

export default function EmptyRoomCard({
  roomNumber,
  onParticipantsUpdated,
}: EmptyRoomCardProps): React.ReactElement {
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);

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
          action={() => setIsAddingParticipant(true)}
          is_active={isAddingParticipant}
        />
      </Flex>

      {isAddingParticipant && (
        <AddParticipantCard
          roomNumber={roomNumber}
          onClose={() => setIsAddingParticipant(false)}
          onParticipantsUpdated={onParticipantsUpdated}
        />
      )}
    </Flex>
  );
}

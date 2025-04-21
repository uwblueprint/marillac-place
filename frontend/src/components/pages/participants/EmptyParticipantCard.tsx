import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import AddParticipantCard from "./AddParticipantCard";

type EmptyParticipantCardProps = {
  roomNumber: string;
};

const EmptyParticipantCard = ({ roomNumber }: EmptyParticipantCardProps) => {
  const [addParticipant, setAddParticipant] = useState(false);
  return (
    <Flex
      w="19%"
      h="45%"
      border="solid"
      borderColor="neutral.200"
      borderRadius="5px"
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
      pb="1.2%"
    >
      <Flex
        position="absolute"
        top="0px"
        w="100%"
        justifyContent="center"
        p="1.5%"
        borderBottom="solid"
        borderColor="neutral.200"
        bg="#E3ECEB"
        fontSize="small"
        fontWeight="700"
      >
        Room {roomNumber}
      </Flex>
      <Flex fontSize="xs">This room is empty.</Flex>
      <Button
        position="absolute"
        bottom="10%"
        size="xs"
        fontSize="xs"
        bg="secondary.500"
        color="white"
        onClick={() => setAddParticipant(true)}
      >
        Add Participant
      </Button>
      {addParticipant && (
        <AddParticipantCard
          roomNumber={roomNumber}
          close={() => setAddParticipant(false)}
        />
      )}
    </Flex>
  );
};

export default EmptyParticipantCard;

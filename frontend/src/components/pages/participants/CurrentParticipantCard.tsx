import { Button, Flex, Text } from '@chakra-ui/react';
import React from 'react'

type CurrentParticipantCardProps = {
    roomNumber: string;
    participantId: string;
    arrival: string;
    password: string;
}

const CurrentParticipantCard = ({roomNumber, participantId, arrival, password}: CurrentParticipantCardProps) => {
  return (
    <Flex 
        w="175px"
        h="125px"
        border="2px solid"
        borderColor="#E2E8F0"
        borderRadius="5px"
        flexDir="column"
        justifyContent="top"
        alignItems="center"
    >
        <Flex w="full" justifyContent="center" p="5px" bg="#E3ECEB" fontSize="small" fontWeight="700">Room {roomNumber}</Flex>
        <Flex
            w="full"
            h="full"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            gap="5px"
        >
            <Flex fontSize="xs">ID Number: { participantId }</Flex>
            <Flex fontSize="xs">Arrival Date: { arrival }</Flex>
            <Button size="xs" bg="orange.500" color="white" mt="3px">Edit Participant</Button>
        </Flex>
    </Flex>
  )
}

export default CurrentParticipantCard

import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import EditParticipantCard from './EditParticipantCard';

type CurrentParticipantCardProps = {
    roomNumber: string;
    participantId: string;
    arrival: string;
    password: string;
}

const CurrentParticipantCard = ({roomNumber, participantId, arrival, password}: CurrentParticipantCardProps) => {
    const [editParticipant, setEditParticipant] = useState(false);
    return (
        <Flex 
            w="180px"
            h="130px"
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
                <Button 
                    size="xs" 
                    bg="orange.500" 
                    color="white" 
                    mt="3px"
                    onClick={() => setEditParticipant(true)}
                >
                    Edit Participant
                </Button>
            </Flex>
            {editParticipant && 
                <EditParticipantCard 
                    selectedRoomNumber={roomNumber} 
                    selectedParticipantId={participantId} 
                    selectedArrival={arrival} 
                    selectedPassword={password} 
                    close={() => setEditParticipant(false)}
                /> 
            }
        </Flex>
    )
}

export default CurrentParticipantCard

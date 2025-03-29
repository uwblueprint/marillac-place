import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import EditParticipantCard from './EditParticipantCard';

type CurrentParticipantCardProps = {
    roomNumber: string;
    participants: Record<string, any>
}

const CurrentParticipantCard = ({roomNumber, participants}: CurrentParticipantCardProps) => {
    const [editParticipant, setEditParticipant] = useState(false);
    return (
        <Flex 
            w="17%"
            h="150px"
            border="solid"
            borderColor="gray.200"
            borderRadius="5px"
            flexDir="column"
            justifyContent="top"
            alignItems="center"
            marginBottom="20px"
            position="relative"
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
                <Flex fontSize="xs">ID Number: { participants[roomNumber].participantId }</Flex>
                <Flex fontSize="xs">Arrival Date: { participants[roomNumber].arrival }</Flex>
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
            <Flex
                position="absolute"
                top="0px"
            >
                {editParticipant && 
                    <EditParticipantCard 
                        selectedRoomNumber={roomNumber} 
                        participants={participants}
                        close={() => setEditParticipant(false)}
                    /> 
                }
            </Flex>
        </Flex>
    )
}

export default CurrentParticipantCard

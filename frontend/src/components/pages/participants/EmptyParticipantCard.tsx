import { Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import AddParticipantCard from './AddParticipantCard';

type EmptyParticipantCardProps = {
    roomNumber: string;
}

const EmptyParticipantCard = ({roomNumber}: EmptyParticipantCardProps) => {
    const [addParticipant, setAddParticipant] = useState(false);
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
                <Flex fontSize="xs">The room is empty.</Flex>
                <Button 
                    size="xs" 
                    bg="orange.500" 
                    color="white" 
                    mt="3px"
                    onClick={() => setAddParticipant(true)}
                >
                    Add Participant
                </Button>
            </Flex>
            {addParticipant && <AddParticipantCard roomNumber={roomNumber} close={() => setAddParticipant(false)} />}
        </Flex>
    )
}

export default EmptyParticipantCard

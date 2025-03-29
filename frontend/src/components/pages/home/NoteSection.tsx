import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const NoteSection = () => {
    return (
        <Flex
            margin="10px"
            paddingY="10px"
            paddingX="20px"
            w="250px"
            border='2px' 
            borderColor='gray.200'
            borderRadius="md"
        >
            <Text
                fontSize="lg"
                fontWeight="600"
                color="#0C727E"
            >
                Notes
            </Text>
        </Flex>
    )
}

export default NoteSection

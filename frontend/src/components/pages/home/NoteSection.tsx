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
                fontSize="md"
                fontWeight="500"
                color="#0E373B"
            >
                Notes
            </Text>
        </Flex>
    )
}

export default NoteSection

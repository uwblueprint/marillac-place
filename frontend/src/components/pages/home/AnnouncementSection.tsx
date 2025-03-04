import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const AnnouncementSection = () => {
    return (
        <Flex
            margin="10px"
            paddingY="10px"
            paddingX="20px"
            flexGrow={1}
            border='2px' 
            borderColor='gray.200'
            borderRadius="md"
        >
            <Text
                fontSize="md"
                fontWeight="500"
                color="#0E373B"
            >
                Announcements
            </Text>
        </Flex>
    )
}

export default AnnouncementSection


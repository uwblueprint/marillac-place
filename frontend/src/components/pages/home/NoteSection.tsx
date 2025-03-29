import { Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import SendSvg from '../../../assets/svg/SendSvg';
import FormInputField from '../../common/FormInputField';

const NoteSection = () => {
    const [note, setNote] = useState("");

    return (
        <Flex
            margin="10px"
            paddingY="10px"
            paddingX="20px"
            w="300px"
            border='2px' 
            borderColor='gray.200'
            borderRadius="md"
        >
            <Flex
                w="100%"
                h="25px"
                flexDir="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Text
                    fontSize="lg"
                    fontWeight="600"
                    color="#0C727E"
                    mb="0px"
                >
                    Admin Notes
                </Text>
                <Text
                    fontSize="xs"
                    fontWeight="400"
                    color="gray.400"
                    mb="0px"
                >
                    Expires in 48h
                </Text>
            </Flex>
            <FormInputField 
                label=""
                value={note}
                type="text"
                onChange={(e) => setNote(e.target.value)}
                
            />

            {/* label: string;
              placeholder?: string;
              value: string | number | undefined;
              type: "text" | "password" | "date" | "number";
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
              required?: boolean;
              leftElement?: string; */}
        </Flex>
    )
}

export default NoteSection

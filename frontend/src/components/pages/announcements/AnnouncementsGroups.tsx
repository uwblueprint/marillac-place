import React, { FC, ReactElement, ReactNode, useState, useEffect } from "react";
import {
    Box,
    Flex,
    Text,
    InputGroup,
    InputLeftElement,
    Input,
    Stack,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    TabIndicator,
    useBreakpointValue
  } from "@chakra-ui/react";
import { SearchIcon, EditIcon } from '@chakra-ui/icons'
import { JSX } from "react/jsx-runtime";

import { GroupMessagesType } from "./types";

// const createGroupBox = (
//     idx: number,
//     activeStep: number,
//     label: string,
//   ): React.ReactNode => (
//     <VStack
//       marginLeft="20px"
//       spacing="-2px"
//       alignItems="left"
//       justifyContent="center"
//     >
//       <Text
//         opacity={1}
//         marginTop="-8px"
//         fontFamily="Raleway"
//         fontSize="12px"
//         textAlign="left"
//         color="#8B8B8B"
//       >
//         STEP {idx + 1}
//       </Text>
//       <Text
//         opacity={1}
//         fontFamily="Raleway"
//         fontSize="20px"
//         fontWeight={activeStep === idx ? "bold" : "normal"}
//         textAlign="left"
//       >
//         {label}
//       </Text>
//     </VStack>
//   );

interface MessageI {
    all: GroupMessagesType[],
    private: GroupMessagesType[],
    groups: GroupMessagesType[],
}

const formatRooms = (roomIDs: number[]) => {
    // Map each room ID to its formatted string
    const formattedRooms = roomIDs.map(id => `Room ${id}`);
    
    // Join the formatted room strings with commas
    return formattedRooms.join(', ');
}

const GroupList: FC<{ messages: GroupMessagesType[] }> = ({ messages }) => {    
    const [processedMessages, setProcessedMessages] = useState<MessageI>();

    useEffect(() => {
        // for each message in messages, recipient size 1 -> private, else groups
        const procMessages: MessageI = {all: [], private: [], groups: [] };
        for (let i = 0; i < messages.length; i += 1) {
            if (messages[i].recipients.length === 1) {
                procMessages.private.push(messages[i])
            } else if (messages[i].recipients.length > 1) {
                procMessages.groups.push(messages[i]) 
            }
            procMessages.all.push(messages[i])
        }
        setProcessedMessages(procMessages);
    }, [])
    
    return (
        <Box
        h="calc(100vh)"
        borderRight="solid"
        borderRightColor="grey"
        w="100%"
    >
        <Flex align="center">
            <Box
                h="20%"
                w="100%"
            >
                <Stack spacing={0}>
                    <Stack direction ="row" spacing={3}
                        pt={7}
                        pl={5}
                        pr={5}
                        pb={7}
                        bg="lightPurple"
                    >
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                                <SearchIcon color='grey' />
                            </InputLeftElement>
                            <Input
                                placeholder='Basic usage' 
                                border="solid"
                                borderColor="grey"
                            />
                        </InputGroup>
                        <Button
                            bg="white"
                            boxSize="40px"
                            border="solid"
                            borderColor="grey"
                        >
                            <EditIcon 
                                color='purple' 
                                boxSize={6}
                            />
                        </Button>
                    </Stack>
                    <Tabs isFitted variant='unstyled'>
                    <TabList
                        bg="lightPurple"
                        borderBottom="solid"
                        borderBottomColor="grey"
                    >
                        <Tab>All</Tab>
                        <Tab>Private</Tab>
                        <Tab>Groups</Tab>
                    </TabList>
                        <TabIndicator
                            mt="-3.5px"
                            height="3px"
                            bg="purple"
                            borderRadius="1px"
                        />
                    <TabPanels
                        bg="white"
                    >
                        <TabPanel>
                        {processedMessages && processedMessages?.all.map((message, index) => (
                            <div key={index}>
                                <p>{formatRooms(message.recipients)}</p>
                                <p>{message.messages[0].createdAt}</p>
                                <p>{message.messages[0].message}</p>
                            </div>
                        ))}
                        </TabPanel>
                        <TabPanel>
                        {processedMessages && processedMessages?.private.map((message, index) => (
                            <div key={index}>
                                <p>{formatRooms(message.recipients)}</p>
                                <p>{message.messages[0].createdAt}</p>
                                <p>{message.messages[0].message}</p>
                            </div>
                        ))}
                        </TabPanel>
                        <TabPanel>
                        {processedMessages && processedMessages?.groups.map((message, index) => (
                            <div key={index}>
                                <p>{formatRooms(message.recipients)}</p>
                                <p>{message.messages[0].createdAt}</p>
                                <p>{message.messages[0].message}</p>
                            </div>
                        ))}
                        </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Stack>
            </Box>
        </Flex>
    </Box>
    )
}

export default GroupList;
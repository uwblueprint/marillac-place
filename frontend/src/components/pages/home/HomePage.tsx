import React, { useEffect, useState } from "react";
import { Flex, Box, Grid, Text } from "@chakra-ui/react";
import { Rectangle } from "@mui/icons-material";

import RoomGrid from "./RoomGrid";

const rooms = [
    { id: 1, name: 'Room 1', info: 'Info about Room 1' },
    { id: 2, name: 'Room 2', info: 'Info about Room 2' },
    { id: 3, name: 'Room 3', info: 'Info about Room 3' },
    { id: 4, name: 'Room 4', info: 'Info about Room 4' },
    { id: 5, name: 'Room 5', info: 'Info about Room 5' },
    { id: 6, name: 'Room 6', info: 'Info about Room 6' },
    { id: 7, name: 'Room 7', info: 'Info about Room 7' },
    { id: 8, name: 'Room 8', info: 'Info about Room 8' },
    { id: 9, name: 'Room 9', info: 'Info about Room 9' },
    { id: 10, name: 'Room 10', info: 'Info about Room 10' },
  ];
  
const HomePage = (): React.ReactElement => {
return (
    <Flex flexDir="column" alignItems="center" flexGrow={1}>
        <Box w="100%" h="13%" borderWidth={2} bg="purple.50" />
        <Flex flexDir="column" w="66%" flexGrow={1} position="absolute" top="2%">
            <Text fontSize="2xl" fontWeight="bold" textAlign="left" alignItems="center" paddingY="15px">
                Marillac Place Overview
            </Text>
            {/* <Flex w="67%" h="100%" borderWidth={2}>
                hello
            </Flex> */}
            <RoomGrid />
            <Flex w="100%" h="288px" borderWidth={2} marginTop="36px" />
        </Flex>

    </Flex>
);
};

export default HomePage;

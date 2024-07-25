import React, { useEffect, useState } from "react";
import { Flex, Box, Grid, Text } from "@chakra-ui/react";
import { Rectangle } from "@mui/icons-material";

import RoomGrid from "./RoomGrid";
  
const HomePage = (): React.ReactElement => {
return (
    <Flex flexDir="column" alignItems="center" flexGrow={1}>
        <Box w="100%" h="13%" borderWidth={2} bg="purple.50" />
        <Flex flexDir="column" w="65%" flexGrow={1} position="absolute" top="2%">
            <Text fontSize="2xl" fontWeight="bold" textAlign="left" alignItems="center" paddingY="12px">
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

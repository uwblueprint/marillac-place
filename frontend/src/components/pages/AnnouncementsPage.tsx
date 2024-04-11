import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Flex,
    Text,
    useBreakpointValue,
  } from "@chakra-ui/react";
import SideBar from "../common/SideBar";
import AnnouncementsView from "./AnnouncementsView";


const AnnouncementsPage = (children: any): React.ReactElement => {
    return (
        <Flex>
            <SideBar>{children}</SideBar>
            <Flex flexDir="row" alignItems="flex-start" w="100%">
                <Box
                    h="calc(100vh)"
                    borderRight="solid"
                    borderRightColor="grey"
                    pt={10}
                    pr={4}
                    pl={4}
                    w="70%"
                >
                    <Flex align="center">
                        <Text>Groups</Text>
                    </Flex>
                </Box>
                <AnnouncementsView/>
            </Flex>
        </Flex>
    )
}  

export default AnnouncementsPage;
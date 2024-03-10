import React from "react";
import { useNavigate } from "react-router-dom";
import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel, Center, Box, Image, Wrap, WrapItem, Avatar, Text, Stack, Flex, Heading } from '@chakra-ui/react';

export type SideBarProps = {
  height?: string;
};

const SideBar = (props:any) => {
  const navigate = useNavigate();

  const handleTabClick = (path: any) => {
    navigate(path);
  };

  return (
    <Flex flexDir="column" w="15%" height="calc">
      <Box h="calc(100vh)" borderRight="solid" borderRightColor="#c5c8d8" pt={10} pr={4} pl={4}>
      <Flex 
          flexDir="column"
          alignItems="flex-start"
          w="100%"
          pb={20}
          >
          <Box
            border="solid"
            borderColor="#c5c8d8"
            pl={2}
            pr={2}
            w="100%"
            borderRadius="8px"
            >
            <Flex align="center">
              <Avatar name='Dan Abrahmov' src="https://bit.ly/2k1H1t6" />
              <Flex flexDir = "column" ml={4}>
                <Heading size="sm" mt={4}>Jane Doe</Heading>
                <Text>Adminstrative Staff</Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>

      <Tabs orientation="vertical" variant="solid-rounded" size="lg">
        <TabList w="100%">
          <Tab borderRadius="8px" justifyContent="stretch" textAlign="left" onClick={() => handleTabClick("/home")} _selected={{bg: "#57469D", color: "white"}}>Home</Tab>
          <Tab borderRadius="8px" justifyContent="stretch" textAlign="left" onClick={() => handleTabClick("/tasks")} _selected={{bg: "#57469D", color: "white"}}>Tasks</Tab>
          <Tab borderRadius="8px" justifyContent="stretch" textAlign="left" onClick={() => handleTabClick("/approvals")} _selected={{bg: "#57469D", color: "white"}}>Approvals</Tab>
          <Tab borderRadius="8px" justifyContent="stretch" textAlign="left" onClick={() => handleTabClick("/schedule")} _selected={{bg: "#57469D", color: "white"}}>Schedule</Tab>
          <Tab borderRadius="8px" justifyContent="stretch" textAlign="left" onClick={() => handleTabClick("/participants")} _selected={{bg: "#57469D", color: "white"}}>Participants</Tab>
          <Tab borderRadius="8px" justifyContent="stretch" textAlign="left" onClick={() => handleTabClick("/insights")}  _selected={{bg: "#57469D", color: "white"}}>Insights</Tab>
        </TabList>
      </Tabs>
      </Box>
    </Flex>
  );
};

export default SideBar;

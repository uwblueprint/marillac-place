import React, { useEffect, useState } from "react";
import { 
  Flex,
  Tabs,
  TabList,
  Tab,
  Heading,
  Box,
  Text,
  Button
 } from "@chakra-ui/react";

import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import SideBar from "../../common/SideBar";

const SchedulePage = (): React.ReactElement => {
  return (
    <Flex>
      <SideBar />
      <Flex flexDir="column" flexGrow={1}>
      <Tabs variant="horizontal" h="30px" mb={6}>
          <TabList pl={6}>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("REQUIRED");
              // }}
            >
              Room 1
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("OPTIONAL");
              // }}
            >
              Room 2
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CUSTOM");
              // }}
            >
              Room 3
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CHORE");
              // }}
            >
              Room 4
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CHORE");
              // }}
            >
              Room 5
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CHORE");
              // }}
            >
              Room 6
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CHORE");
              // }}
            >
              Room 7
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CHORE");
              // }}
            >
              Room 8
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CHORE");
              // }}
            >
              Room 9
            </Tab>
            <Tab width="10%"
              // onClick={() => {
              //   setTaskType("CHORE");
              // }}
            >
              Room 10
            </Tab>
          </TabList>
        </Tabs>
        <Flex justifyContent="space-between">
          <Flex>
            <Heading size="lg" fontSize="32px" mt={10} ml={8}>
              January 2025 
              {/* see announcements page for how to determine what text shows */}
            </Heading>
            <Flex mt={10} w='200px' flexDir="row" height='100px'>
              <Button borderRightRadius='0'>
                <ArrowBackIosNew fontSize='small' sx={{color: "#57469D"}} />
              </Button>
              <Button alignContent='center' borderRadius='0' sx={{color: "#57469D"}}>
                Jan 1 - 7
              </Button>
              <Button borderLeftRadius='0'>
                <ArrowForwardIos fontSize='small' sx={{color: "#57469D"}} />
              </Button>
            </Flex>
          </Flex>
          <Flex>
            <Heading>
              test
            </Heading>
          </Flex>
        </Flex>
      </Flex>
  </Flex>
  );
};

export default SchedulePage;

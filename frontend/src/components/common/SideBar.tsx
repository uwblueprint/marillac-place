import React from "react";

import { ChakraProvider, Tabs, TabList, TabPanels, Tab, TabPanel, Center, Box, Image, Wrap, WrapItem, Avatar, Text, Stack, Flex } from '@chakra-ui/react';

export type SideBarProps = {
  height?: string;
};

const SideBar = (props:any) => {
  const pages = ["Home", "Tasks", "Approvals", "Schedule", "Participants", "Insights"]
  return (
    <div>
      {/* <SideBar>
        <TabList>
          <Tab>Hi</Tab>
          <Tab>Hi</Tab>
        </TabList>
      </SideBar> */}

      {/* <Box display="flex" alignItems="center" maxWidth="250px" maxHeight="80px" borderWidth="2px" padding="8px" borderRadius="6px">
        <Image borderRadius="50%" width="50px" height="50px" src="https://bit.ly/2k1H1t6" />
        <div style={{ marginLeft: "10px" }}>
          <div>Jane Doe</div>
          <div>Administrative Staff</div>
        </div>
      </Box> */}

      <Wrap>
        <WrapItem>
          <Box display="flex"  maxWidth="250px" maxHeight="80px" borderWidth="2px" padding="8px" borderRadius="6px">
          <Avatar name='Dan Abrahmov' src="https://bit.ly/2k1H1t6" />
          <Stack pl="10px">
            <Text>Jane Doe</Text>
            <Text>Adminstrative Staff</Text>
          </Stack>
          </Box>
        </WrapItem>
      </Wrap>

      {/* <Flex
        flexDir = "column"
        
      > */}
      {/* </Flex> */}

      <Tabs orientation="vertical" variant="solid-rounded" size="lg">
        <TabList>
          <Tab>Home</Tab>
          <Tab>Tasks</Tab>
          <Tab>Approvals</Tab>
          <Tab>Schedule</Tab>
          <Tab>Participants</Tab>
          <Tab>Insights</Tab>
        </TabList>
      </Tabs>
    </div>
  );
};

export default SideBar;

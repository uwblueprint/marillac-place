import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

import AnnouncementsView from "./AnnouncementsView";

const AnnouncementsPage = (): React.ReactElement => {
  return (
    <Flex flexDir="row" alignItems="flex-start" w="100%">
      <Box
        h="100vh"
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
      <AnnouncementsView />
    </Flex>
  );
};

export default AnnouncementsPage;

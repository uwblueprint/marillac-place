import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const RoomSection = () => {
  return (
    <Flex
      margin="10px"
      paddingY="15px"
      paddingX="20px"
      flexGrow={1}
      border="2px"
      borderColor="gray.200"
      borderRadius="md"
    >
      <Text fontSize="lg" fontWeight="600" color="teal.main">
        Rooms
      </Text>
    </Flex>
  );
};

export default RoomSection;

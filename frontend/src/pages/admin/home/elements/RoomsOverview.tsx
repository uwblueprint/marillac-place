import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export default function RoomsOverview() {
  return (
    <Flex
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      height="55%"
      marginRight="10px"
      marginBottom="10px"
    >
      <Text textStyle="web.h3" color="primary.700">
        Rooms
      </Text>
    </Flex>
  )
}
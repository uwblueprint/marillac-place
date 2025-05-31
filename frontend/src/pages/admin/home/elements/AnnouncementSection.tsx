import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export default function AnnouncementSection() {
  return (
    <Flex
      paddingY="15px"
      paddingX="20px"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="8px"
      flexGrow={1}
      marginRight="10px"
    >
      <Text textStyle="web.h3" color="primary.700">
        Announcements
      </Text>
    </Flex>
  )
}
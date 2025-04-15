import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const AnnouncementSection = () => {
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
        Announcements
      </Text>
    </Flex>
  );
};

export default AnnouncementSection;

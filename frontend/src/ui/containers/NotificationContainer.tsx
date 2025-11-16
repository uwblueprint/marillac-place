import React from "react";
import { Flex, Text } from "@chakra-ui/react";

type NotificationProps = {
  message: string;
};

export default function NotificationContainer({ message }: NotificationProps) {
  return (
    <Flex
      position="absolute"
      top="25px"
      left="50%"
      transform="translateX(-50%)"
      border="2px solid"
      borderRadius="8px"
      borderColor="success.800"
      zIndex="1000"
      paddingY="6px"
      paddingX="12px"
      justifyContent="center"
      alignItems="center"
      gap="10px"
      boxShadow="xl"
      bg="success.100"
    >
      {/* TODO: Add checkmark icon */}
      <Text color="success.900" textStyle="web.b2" fontWeight="600">
        {message}
      </Text>
    </Flex>
  );
}

import { Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

type LoadingScreenProps = {
  message?: string;
};
export default function LoadingScreen({
  message = "Loading...",
}: LoadingScreenProps) {
  return (
    <Flex
      width="100%"
      minH="100%"
      align="center"
      justify="center"
      direction="column"
      gap={3}
      role="status"
    >
      <Spinner size="xl" color="brand.primaryDark" thickness="4px" />
      <Text fontSize="md" color="gray.600">
        {message}
      </Text>
    </Flex>
  );
}

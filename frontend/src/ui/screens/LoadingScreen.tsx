import { Flex } from "@chakra-ui/react";
import React from "react";

// TODO: Design and implement common loading screen (compatible with mobile and web)
// Accepts optional loading message as a prop, defaults to "Loading..."
export default function Loading() {
  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      loading...
    </Flex>
  );
}

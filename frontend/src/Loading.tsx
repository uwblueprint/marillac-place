import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

export default function Loading() {
  return (
    <Flex
      w="100vw"
      h="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner color="primary.700" size="lg" />
    </Flex>
  )
}
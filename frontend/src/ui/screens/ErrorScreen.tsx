// TODO:
// Design and implement common error popup (works on both mobile and web)
// Accepts error message as a prop
// Default error message is "Something went wrong. Please try again later."
// Along with contact support information

import { Flex } from "@chakra-ui/react";
import React from "react";

export default function Error() {
  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      error
    </Flex>
  );
}

// TODO:
// Design and implement common error popup (works on both mobile and web)
// Displays error, along with contact support information
// Add to UI page

import { Flex } from "@chakra-ui/react";
import React from "react";

type ErrorScreenProps = {
  message?: string;
};

export default function ErrorScreen({
  message = "Something went wrong. Please try again later.",
}: ErrorScreenProps) {
  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      {message}
    </Flex>
  );
}

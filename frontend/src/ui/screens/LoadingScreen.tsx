import { Flex } from "@chakra-ui/react";
import React from "react";

// TODO: Design and implement common loading screen (compatible with mobile and web)
// Accepts optional loading message as a prop, defaults to "Loading..."
// Add to UI page

type LoadingScreenProps = {
  message?: string;
};
export default function LoadingScreen({
  message = "Loading...",
}: LoadingScreenProps) {
  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
      {message}
    </Flex>
  );
}

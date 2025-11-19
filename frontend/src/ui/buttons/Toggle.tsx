import { Box, Flex } from "@chakra-ui/react";
import React from "react";

interface ToggleProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

export default function Toggle({ active, setActive }: ToggleProps) {
  return (
    <Box
      as="button"
      position="relative"
      width="60px"
      height="32px"
      borderRadius="16px"
      bg={active ? "primary.700" : "neutral.300"}
      cursor="pointer"
      transition="background-color 0.3s ease"
      onClick={() => setActive(!active)}
      _hover={{
        opacity: 0.8,
      }}
      _active={{
        opacity: 0.9,
      }}
    >
      <Box
        position="absolute"
        top="4px"
        left={active ? "32px" : "4px"}
        width="24px"
        height="24px"
        borderRadius="50%"
        bg="neutral.0"
        transition="left 0.3s ease"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
      />
    </Box>
  );
}

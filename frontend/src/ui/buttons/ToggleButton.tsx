import { Box, Flex } from "@chakra-ui/react";
import React from "react";

interface ToggleButtonProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

export default function ToggleButton({ active, setActive }: ToggleButtonProps) {
  return (
    <Box
      as="button"
      position="relative"
      width="42px"
      height="24px"
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
        left={active ? "22px" : "4px"}
        width="16px"
        height="16px"
        borderRadius="50%"
        bg="neutral.0"
        transition="left 0.3s ease"
        boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
      />
    </Box>
  );
}

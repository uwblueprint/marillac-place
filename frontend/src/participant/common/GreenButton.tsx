import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types/component";

export default function GreenButton({ text, action, is_active }: ButtonProps) {
  return (
    <Button
      onClick={action}
      isActive={is_active}
      cursor="pointer"
      borderRadius="4px"
      border="1px"
      borderColor="#0C727E"
      width="fit-content"
      height="fit-content"
      paddingX="10px"
      paddingY="8px"
      bg="#FFFFFF"
      color="#0C727E"
      _hover={{
        color: "#FFFFFF",
        bg: "#0C727E",
      }}
      _active={{
        color: "#FFFFFF",
        bg: "#0C727E",
      }}
    >
      <Text textStyle="mobile.c1" color="inherit">
        {text}
      </Text>
    </Button>
  );
}
import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types";

export default function OrangeButton({ text, action, is_active }: ButtonProps) {
  return (
    <Button
      onClick={action}
      isActive={is_active}
      cursor="pointer"
      borderRadius="8px"
      border="1px"
      borderColor="#E67D4F"
      width="fit-content"
      height="fit-content"
      paddingX="12px"
      paddingY="6px"
      bg="#E67D4F"
      _hover={{
        borderColor: "#D76A3B",
        bg: "#D76A3B",
      }}
      _active={{
        borderColor: "#D76A3B",
        bg: "#D76A3B",
      }}
    >
      <Text textStyle="web.s1" color="#FFFFFF">
        {text}
      </Text>
    </Button>
  );
}

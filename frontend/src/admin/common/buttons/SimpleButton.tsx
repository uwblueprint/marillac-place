import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../../types";

type SimpleButtonProps = ButtonProps & {
  text_color: string;
};

export default function SimpleButton({
  text,
  action,
  is_active,
  text_color,
}: SimpleButtonProps) {
  return (
    <Button
      onClick={action}
      isActive={is_active}
      cursor="pointer"
      borderRadius="8px"
      border="1px"
      borderColor="#C5C8D8"
      width="fit-content"
      height="fit-content"
      paddingX="12px"
      paddingY="6px"
      bg="#FFFFFF"
      _hover={{
        bg: "#F5F6F8",
      }}
      _active={{
        bg: "#F5F6F8",
      }}
    >
      <Text textStyle="web.s1" color={text_color}>
        {text}
      </Text>
    </Button>
  );
}

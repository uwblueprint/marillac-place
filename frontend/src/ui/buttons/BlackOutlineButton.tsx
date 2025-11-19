import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types/component";

type BlackOutlineButtonProps = ButtonProps & {
  text_color?: string;
};

export default function BlackOutlineButton({
  label,
  action,
  is_active,
  text_color = "#000000",
  icon,
}: BlackOutlineButtonProps) {
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
      <Flex alignItems="center" gap="5px">
        {icon}
        <Text textStyle="web.s1" color={text_color}>
          {label}
        </Text>
      </Flex>
    </Button>
  );
}

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
  text_color = "text.dark",
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
      bg="white"
      _hover={{
        bg: "background.highlight",
      }}
      _active={{
        bg: "background.highlight",
      }}
    >
      <Flex alignItems="center" gap="5px">
        {icon}
        <Text textStyle="s2" color={text_color}>
          {label}
        </Text>
      </Flex>
    </Button>
  );
}

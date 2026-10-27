import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types/component";

type BlackOutlineButtonProps = ButtonProps & {
  text_color?: string;
  active_color?: string;
};

export default function BlackOutlineButton({
  label,
  action,
  is_active,
  text_color = "text.dark",
  icon,
  active_color,
}: BlackOutlineButtonProps) {
  const activeColor = is_active ? active_color : undefined;

  return (
    <Button
      onClick={action}
      isActive={is_active}
      cursor="pointer"
      borderRadius="8px"
      border="1px"
      borderColor={activeColor ?? "#C5C8D8"}
      width="fit-content"
      height="fit-content"
      paddingX="12px"
      paddingY="6px"
      bg={activeColor ?? "white"}
      boxShadow={activeColor ? "0 0 0 2px #E67D4F" : "none"}
      _hover={{
        bg: activeColor ?? "background.highlight",
      }}
      _active={{
        bg: activeColor ?? "background.highlight",
      }}
    >
      <Flex alignItems="center" gap="5px">
        {icon}
        <Text textStyle="s2" color={activeColor ? "white" : text_color}>
          {label}
        </Text>
      </Flex>
    </Button>
  );
}

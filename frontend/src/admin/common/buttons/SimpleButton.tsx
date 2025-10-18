import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../../types/component";

type SimpleButtonProps = ButtonProps & {
  text_color: string;
  icon?: JSX.Element;
};

export default function SimpleButton({
  text,
  action,
  is_active,
  text_color,
  icon
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
      <Flex alignItems="center" gap="5px">
        {icon && (
          <Flex width="12px" height="12px" alignItems="center" justifyContent="center">
            {icon}
          </Flex>
        )}
        <Text textStyle="web.s1" color={text_color}>
          {text}
        </Text>
      </Flex>
    </Button>
  );
}

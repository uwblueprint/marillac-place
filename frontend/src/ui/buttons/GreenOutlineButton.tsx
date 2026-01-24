import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types/component";

export default function GreenOutlineButton({
  label,
  action,
  is_active,
  icon,
}: ButtonProps) {
  return (
    <Button
      onClick={action}
      isActive={is_active}
      cursor="pointer"
      borderRadius="8px"
      border="1px"
      borderColor="#0C727E"
      width="fit-content"
      height="fit-content"
      paddingX="12px"
      paddingY="6px"
      bg="white"
      color="#0C727E"
      _hover={{
        color: "white",
        bg: "brand.primaryDark",
      }}
      _active={{
        color: "white",
        bg: "brand.primaryDark",
      }}
    >
      <Flex alignItems="center" gap="5px">
        {icon}
        <Text textStyle="s2" color="inherit">
          {label}
        </Text>
      </Flex>
    </Button>
  );
}

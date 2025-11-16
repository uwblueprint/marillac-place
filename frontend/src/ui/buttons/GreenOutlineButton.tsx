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
      <Flex alignItems="center" gap="5px">
        {icon}
        <Text textStyle="web.s1" color="inherit">
          {label}
        </Text>
      </Flex>
    </Button>
  );
}

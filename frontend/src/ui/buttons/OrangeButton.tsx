import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types/component";

export default function OrangeButton({
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
      borderColor="brand.secondaryDark"
      width="fit-content"
      height="fit-content"
      paddingX="12px"
      paddingY="6px"
      bg="brand.secondaryDark"
      _hover={{
        borderColor: "#D9764A",
        bg: "#D9764A",
      }}
      _active={{
        borderColor: "#D9764A",
        bg: "#D9764A",
      }}
    >
      <Flex alignItems="center" gap="6px">
        {icon}
        <Text textStyle="s2" color="white">
          {label}
        </Text>
      </Flex>
    </Button>
  );
}

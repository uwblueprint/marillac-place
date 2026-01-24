import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { ButtonProps } from "../../types/component";

type UnderlineButtonProps = Omit<ButtonProps, "is_active" | "icon">;

export default function UnderlineButton({
  label,
  action,
}: UnderlineButtonProps) {
  return (
    <Button
      onClick={action}
      width="fit-content"
      height="fit-content"
      padding="0px"
      cursor="pointer"
      background="transparent"
      _hover={{
        background: "transparent",
      }}
    >
      <Text
        textStyle="s2"
        color="text.dark"
        textDecoration="underline"
        _hover={{
          textDecoration: "none",
        }}
      >
        {label}
      </Text>
    </Button>
  );
}

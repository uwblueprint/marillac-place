import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { InputProps } from "../../types/component";

type FixedInputProps = Omit<InputProps, "update_action" | "size"> & {
  orientation: "horizontal" | "vertical";
};

export default function FixedInput({
  label = "Label",
  current_value,
  orientation,
}: FixedInputProps) {
  return (
    <Flex
      gap="6px"
      alignItems="flex-start"
      flexDir={orientation === "horizontal" ? "row" : "column"}
      mb="4px"
    >
      <Text textStyle="s2">{label}</Text>
      <Text textStyle="b2">{current_value}</Text>
    </Flex>
  );
}

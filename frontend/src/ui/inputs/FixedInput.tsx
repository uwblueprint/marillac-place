import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { toTitleCase } from "../../helpers/stringUtils";
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
      gap="4px"
      alignItems="flex-start"
      flexDir={orientation === "horizontal" ? "row" : "column"}
      mb="4px"
    >
      <Text textStyle="web.s1" color="text.light.secondary">
        {label}
      </Text>
      <Text textStyle="web.b3" color="text.light.secondary">
        {toTitleCase(current_value as string)}
      </Text>
    </Flex>
  );
}

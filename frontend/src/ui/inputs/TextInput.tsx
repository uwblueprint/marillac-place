import React from "react";
import { FormControl, Input, Text, Box } from "@chakra-ui/react";
import { InputProps } from "../../types/component";

export default function TextInput({
  label,
  current_value,
  update_action,
  size,
}: InputProps) {
  const width =
    size === "small"
      ? "100px"
      : size === "medium"
      ? "200px"
      : size === "large"
      ? "400px"
      : "100%";
  return (
    <FormControl width="100%">
      {label && (
        <Text textStyle="web.s1" color="text.light.secondary" mb="4px">
          {label}
        </Text>
      )}
      <Box width="100%">
        <Input
          type="text"
          value={current_value}
          onChange={(e) => update_action(e.target.value)}
          width={width === "100%" ? "100%" : width}
          height="fit-content"
          paddingX="12px"
          paddingY="6px"
          border="1px"
          borderColor="neutral.300"
          borderRadius="8px"
          fontFamily="Nunito"
          fontWeight="400"
          fontSize="12px"
          color="text.light.primary"
          _focus={{
            borderColor: "neutral.300",
            boxShadow: "none",
          }}
        />
      </Box>
    </FormControl>
  );
}

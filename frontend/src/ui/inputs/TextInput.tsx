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
    size === "small" ? "100px" : size === "medium" ? "250px" : "400px";
  return (
    <FormControl width="100%">
      {label && (
        <Text textStyle="s2" mb="4px">
          {label}
        </Text>
      )}
      <Box width="100%">
        <Input
          type="text"
          value={current_value}
          onChange={(e) => update_action(e.target.value)}
          width={width}
          height="fit-content"
          paddingX="12px"
          paddingY="6px"
          border="1px"
          borderColor="background.border"
          borderRadius="8px"
          fontFamily="Nunito"
          fontWeight="400"
          fontSize="12px"
          color="text.dark"
          _focus={{
            borderColor: "background.border",
            boxShadow: "none",
          }}
        />
      </Box>
    </FormControl>
  );
}

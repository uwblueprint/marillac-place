import React from "react";
import { FormControl, Input, Text } from "@chakra-ui/react";
import { InputProps } from "../../types/component";

export default function NumberInput({
  label,
  current_value,
  placeholder,
  update_action,
  size,
}: InputProps) {
  const width = size === "small" ? "100px" : size === "medium" ? "200px" : "400px";
  return (
    <FormControl>
      {label && (
        <Text textStyle="web.s1" color="text.light.secondary">
          {label}
        </Text>
      )}
      <Input
        type="number"
        value={current_value ? String(current_value) : ""}
        placeholder={placeholder}
        onChange={(e) => update_action(e.target.value ? Number(e.target.value) : undefined)}
        width={width}
        height="fit-content"
        paddingX="12px"
        paddingY="6px"
        border="1px"
        borderColor="#C5C8D8"
        borderRadius="8px"
        fontFamily="Nunito"
        fontWeight="400"
        fontSize="12px"
        color="#000000"
        _focus={{
          borderColor: "#C5C8D8",
          boxShadow: "none",
        }}
      />
    </FormControl>
  );
}
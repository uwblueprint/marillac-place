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
  const width =
    size === "small" ? "100px" : size === "medium" ? "250px" : "400px";
  return (
    <FormControl>
      {label && (
        <Text textStyle="s2" mb="4px">
          {label}
        </Text>
      )}
      <Input
        type="number"
        value={current_value ? String(current_value) : ""}
        placeholder={placeholder}
        onChange={(e) =>
          update_action(e.target.value ? Number(e.target.value) : undefined)
        }
        width={width}
        height="fit-content"
        paddingX="12px"
        paddingY="6px"
        margin="0px"
        border="1px"
        borderColor="#C5C8D8"
        borderRadius="8px"
        fontFamily="Nunito"
        fontWeight="400"
        fontSize="12px"
        color="text.dark"
        _focus={{
          borderColor: "#C5C8D8",
          boxShadow: "none",
        }}
      />
    </FormControl>
  );
}

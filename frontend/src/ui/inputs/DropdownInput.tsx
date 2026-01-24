import React from "react";
import { FormControl, Text, Select } from "@chakra-ui/react";
import { InputProps } from "../../types/component";

type DropdownInputProps = InputProps & {
  value_options: Record<string, string>;
};

export default function DropdownInput({
  label,
  current_value,
  update_action,
  size,
  placeholder = "Please Select",
  value_options,
}: DropdownInputProps) {
  const width =
    size === "small" ? "100px" : size === "medium" ? "250px" : "400px";
  return (
    <FormControl>
      {label && (
        <Text textStyle="s2" mb="4px">
          {label}
        </Text>
      )}
      <Select
        value={current_value ?? ""}
        onChange={(e) => update_action(e.target.value)}
        width={width}
        height="32px"
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
      >
        <option value="">{placeholder}</option>
        {Object.entries(value_options).map(([key, value], index) => (
          <option key={index} value={value}>
            {key}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

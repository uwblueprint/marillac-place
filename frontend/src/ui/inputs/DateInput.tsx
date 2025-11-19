import React from "react";
import { FormControl, Input, Text } from "@chakra-ui/react";
import { InputProps } from "../../types/component";
import {
  formatDateInputValue,
  parseDateInputValue,
} from "../../helpers/formatDateTime";

export default function DateInput({
  label,
  current_value,
  update_action,
  size,
}: InputProps) {
  const width =
    size === "small" ? "100px" : size === "medium" ? "200px" : "400px";
  return (
    <FormControl>
      {label && (
        <Text textStyle="web.s1" color="text.grey" mb="4px">
          {label}
        </Text>
      )}
      <Input
        type="date"
        value={current_value ? formatDateInputValue(current_value) : ""}
        onChange={(e) => update_action(parseDateInputValue(e.target.value))}
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

import React from "react";
import { FormControl, Input, Text } from "@chakra-ui/react";
import { InputProps } from "../../types";
import { formatDateInputValue, formatTimeInputValue, parseDateTimeInputValue } from "../../helpers/formatDateTime";

type DateTimeInputProps = InputProps & {
  type: "date" | "time";
}

export default function DateTimeInput({
  label,
  current_value,
  update_action,
  size,
  type,
}: DateTimeInputProps) {
  const width = size === "small" ? "100px" : size === "medium" ? "200px" : "400px";
  return (
    <FormControl>
      <Text textStyle="web.s1" color="text.light.secondary">
        {label}
      </Text>
      <Input
        type={type}
        value={type === "date" ? formatDateInputValue(current_value) : formatTimeInputValue(current_value)} 
        onChange={(e) => update_action(parseDateTimeInputValue(e.target.value))} 
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
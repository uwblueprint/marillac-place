import React from "react";
import { FormControl, Text, Textarea } from "@chakra-ui/react";
import { InputProps } from "../../types";

export default function TextAreaInput({
  label,
  current_value,
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
      <Textarea
        value={current_value}
        onChange={(e) => update_action(e.target.value)}
        width={width}
        height="75px"
        paddingX="12px"
        paddingY="8px"
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
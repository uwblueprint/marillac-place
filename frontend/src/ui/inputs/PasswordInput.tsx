import React from "react";
import { FormControl, Input, Text } from "@chakra-ui/react";
import { InputProps } from "../../types/component";

export default function PasswordInput({
  label,
  current_value,
  placeholder = "Password",
  update_action,
  size,
}: InputProps) {
  // TODO: add icon for password visibility toggle and handle click event (i.e. input type is text if visible, password if not)
  const width =
    size === "small" ? "100px" : size === "medium" ? "250px" : "400px";
  return (
    <FormControl>
      {label && (
        <Text textStyle="web.s1" color="text.light.secondary" mb="4px">
          {label}
        </Text>
      )}
      <Input
        type="password"
        value={current_value}
        placeholder={placeholder}
        onChange={(e) => update_action(e.target.value)}
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

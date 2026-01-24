import React, { useState } from "react";
import { FormControl, Input, Text, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { InputProps } from "../../types/component";
import { Eye, ClosedEye } from "../icons/MiscIcons";

export default function PasswordInput({
  label,
  current_value,
  placeholder = "Password",
  update_action,
  size,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const width =
    size === "small" ? "100px" : size === "medium" ? "250px" : "400px";
  return (
    <FormControl>
      {label && (
        <Text textStyle="s2" mb="4px">
          {label}
        </Text>
      )}
      <InputGroup>
        <Input
          type={showPassword ? "text" : "password"}
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
          color="text.dark"
          _focus={{
            borderColor: "#C5C8D8",
            boxShadow: "none",
          }}
        />
        <InputRightElement
          h="100%"
          display="flex"
          alignItems="center"
        >
          <IconButton
            aria-label="Toggle password visibility"
            icon={showPassword ? <Eye /> : <ClosedEye />}
            onClick={() => setShowPassword(!showPassword)}
            bg="transparent"
            _hover={{ bg: "transparent" }}
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
}

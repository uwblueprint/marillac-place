import React from "react";
import {
  FormControl,
  RadioGroup,
  Stack,
  Radio,
  Text,
} from "@chakra-ui/react";
import { InputProps } from "../../types";

type SelectInputProps = Omit<InputProps, "size"> & {
  value_options: Record<string, string>;
};

export default function SelectInput({
  label,
  current_value,
  update_action,
  value_options,
}: SelectInputProps) {
  return (
    <FormControl>
      <Text textStyle="web.s1" color="text.light.secondary">
        {label}
      </Text>
      <RadioGroup value={current_value} onChange={(selected) => update_action(selected)}>
        <Stack direction="column" spacing={0.5}>
          {Object.entries(value_options).map(([key, value], index) => (
            <Radio
              key={index}
              value={value}
              size="sm"
              border="1px"
              borderColor="#0C727E"
              _focus={{
                boxShadow: "none",
              }}
              _checked={{
                bg: "#0C727E",
              }}
            >
              <Text textStyle="web.b3" color="#000000">
                {key}
              </Text>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </FormControl>
  );
}
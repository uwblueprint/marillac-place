import React from "react";
import {
  Button,
  Input,
  HStack,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import colors from "../../../theme/colors";
import FormInputField from "../../common/form/FormInputField";

interface Props {
  value: number;
  setValue: (value: number) => void;
}

export default function NumberInput({ value, setValue }: Props) {
  const increment = () => setValue(value + 1);
  const decrement = () => setValue(value - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!Number.isNaN(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <HStack w="175px">
      <Button
        style={{
          border: `1px solid ${colors.purple.main}`,
          backgroundColor: "transparent",
          padding: "0px",
          color: colors.purple.main,
        }}
        onClick={decrement}
      >
        -
      </Button>
      <FormInputField
        label=""
        leftElement="$"
        type="number"
        value={value}
        onChange={handleChange}
      />
      <Button
        style={{
          border: `1px solid ${colors.purple.main}`,
          backgroundColor: "transparent",
          padding: "0px",
          color: colors.purple.main,
        }}
        onClick={increment}
      >
        +
      </Button>
    </HStack>
  );
}

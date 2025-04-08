import React, { useState } from "react";
import {
  Button,
  Input,
  Flex,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type FormInputFieldProps = {
  label: string;
  placeholder?: string;
  value: string | number | undefined;
  type: "text" | "password" | "date" | "number";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  leftElement?: string;
};

const FormInputField = ({
  label,
  placeholder = "",
  value,
  type,
  onChange,
  required = false,
  leftElement = "",
}: FormInputFieldProps): React.ReactElement => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl isRequired={required}>
      {label && (
        <FormLabel mb="5px" color="gray.main" fontWeight="700">
          {label}
        </FormLabel>
      )}

      <InputGroup>
        {leftElement && (
          <InputLeftElement height="34px" pointerEvents="none" color="black">
            <Flex>{leftElement}</Flex>
          </InputLeftElement>
        )}

        <Input
          variant="outline"
          placeholder={placeholder}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          border="solid"
          borderColor="gray.200"
        />

        {type === "password" && (
          <InputRightElement>
            <Button
              onClick={() => setShowPassword(!showPassword)}
              bg="transparent"
              _hover={{ bg: "transparent" }}
            >
              {showPassword ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  );
};

export default FormInputField;

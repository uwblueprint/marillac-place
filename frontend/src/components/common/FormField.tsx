import React from "react";
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

const FormField = ({
  label,
  value,
  type = "text",
  onChange,
  onBlur,
  submitPressed,
  required = false,
  error = false,
  isPassword = false,
  showPassword,
  setShowPassword,
  leftElement,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  submitPressed: boolean;
  required?: boolean;
  error?: boolean;
  isPassword?: boolean;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  leftElement?: string;
}) => (
  <Flex flexDir="column" flex="1">
    <FormControl isRequired={required}>
      <FormLabel mb="5px" color="gray.main" fontWeight="700">
        {label}
      </FormLabel>
      <InputGroup>
        {leftElement && (
          <InputLeftElement height="34px" pointerEvents="none" color="black">
            <Flex>{leftElement}</Flex>
          </InputLeftElement>
        )}

        <Input
          variant="primary"
          placeholder=""
          borderColor={
            error || (submitPressed && !value && required)
              ? "red.error"
              : "gray.300"
          }
          boxShadow={
            error || (submitPressed && !value && required)
              ? "0 0 2px red.error"
              : "none"
          }
          type={
            isPassword && setShowPassword && !showPassword ? "password" : type
          }
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {isPassword && setShowPassword && (
          <InputRightElement h="34px">
            <Button
              onClick={() => setShowPassword(!showPassword)}
              bg="transparent"
              _hover={{ bg: "transparent" }}
            >
              {!showPassword ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
    </FormControl>
  </Flex>
);

export default FormField;

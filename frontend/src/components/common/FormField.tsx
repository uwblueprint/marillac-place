import React from "react";
import {
  Button,
  Input,
  Select,
  Flex,
  FormControl,
  FormLabel,
  InputRightElement,
  InputGroup,
  InputLeftElement,
  Checkbox,
  Container,
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
  isPassword = false,
  showPassword,
  setShowPassword,
  leftElement
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  submitPressed: boolean;
  required?: boolean;
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
        {leftElement && <InputLeftElement height='34px' pointerEvents='none' color='black'>
          <Flex>{leftElement}</Flex>
        </InputLeftElement>}

        <Input
          variant="primary"
          placeholder='Enter amount'
          borderColor={submitPressed && !value ? "red.error" : "gray.300"}
          boxShadow={submitPressed && !value ? "0 0 2px red.error" : "none"}
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

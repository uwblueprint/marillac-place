import React from "react";
import {
  FormControl,
  FormLabel,
  Select,
} from "@chakra-ui/react";

interface Option {
  key: string;
  value: string;
  display: string;
}

type FormSelectFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
};

const FormSelectField = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  required = false,
}: FormSelectFieldProps): React.ReactElement => {
  return (
    <FormControl isRequired={required}>
      {label && (
        <FormLabel mb="5px" color="gray.main" fontWeight="700">
          {label}
        </FormLabel>
      )}
      <Select
        variant="outline"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        borderWidth="2px"
        borderColor="gray.300"
      >
        {options.map((option: Option) => (
          <option key={option.key} value={option.value}>
            {option.display}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default FormSelectField;

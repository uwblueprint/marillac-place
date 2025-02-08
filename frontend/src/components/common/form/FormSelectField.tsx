import React, { useState } from "react";
import {
    Flex,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Select
} from "@chakra-ui/react";

interface Option {
    key: string
    value: string
    display: string
}

type FormSelectFieldProps = {
    label: string;
    placeholder: string;
    value: string;
    options: Option[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    error?: string;
}

const FormSelectField = ({
    label,
    placeholder, 
    value,
    options,
    onChange,
    required = false,
    error = "",
}: FormSelectFieldProps): React.ReactElement => {
    return (
        <FormControl isRequired={required} isInvalid={error !== ""}>
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
                errorBorderColor="red.300"
            >
                {options.map((option: Option) => (
                    <option key={option.key} value={option.value}>{option.display}</option>
                ))}
            </Select>  
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    )
};

export default FormSelectField;
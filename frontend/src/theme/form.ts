import { defineStyleConfig } from '@chakra-ui/react';

import { inputAnatomy, selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const inputHelpers = createMultiStyleConfigHelpers(inputAnatomy.keys);
const selectHelpers = createMultiStyleConfigHelpers(selectAnatomy.keys);

export const Input = inputHelpers.defineMultiStyleConfig({
  variants: {
    primary: {
      field: {
        padding: "8px 16px",
        border: "1px",
        borderColor: '#C5C8D8',
        borderRadius: "8px",
        fontFamily: "Nunito",
        fontWeight: "400",
        fontSize: "12px",
        _placeholder: {
          color: "#808080",
        },
      },
    },
  },
});

export const Select = selectHelpers.defineMultiStyleConfig({
  variants: {
    primary: {
      field: {
        padding: "8px 16px",
        border: "1px",
        borderColor: '#C5C8D8',
        borderRadius: "8px",
        fontFamily: "Nunito",
        fontWeight: "400",
        fontSize: "12px",
      },
    },
  },
});

export const Textarea = defineStyleConfig({
  variants: {
    primary: {
      padding: "8px 16px",
      border: "1px solid",
      borderColor: '#C5C8D8',
      borderRadius: "8px",
      fontFamily: "Nunito",
      fontWeight: "400",
      fontSize: "12px",
      _placeholder: {
        color: "#808080",
        fontWeight: "400",
        fontSize: "12px",
      },
    },
  },
});




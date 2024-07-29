import { inputAnatomy } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  defineStyleConfig,
} from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const primaryInput = definePartsStyle({
  field: {
    height: "34px",
    borderRadius: "8px",
    border: "2px solid #C5C8D8",
  },
});

export const inputTheme = defineMultiStyleConfig({
  variants: { primary: primaryInput },
});

const primaryTextarea = defineStyle({
  borderRadius: "8px",
  border: "2px solid #C5C8D8",
  resize: "none",
  padding: "8px 12px",
});

export const textareaTheme = defineStyleConfig({
  variants: { primary: primaryTextarea },
});

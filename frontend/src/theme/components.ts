import { progressAnatomy, checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle: definePartsStyleProgress, defineMultiStyleConfig: defineMultiStyleConfigProgress } =
  createMultiStyleConfigHelpers(progressAnatomy.keys);

const baseStyleProgress = definePartsStyleProgress({
  track: {
    bg: "brand.primaryLight",
  },
  filledTrack: {
    bg: "brand.primaryDark",
  },
});

export const Progress = defineMultiStyleConfigProgress({
  baseStyle: baseStyleProgress,
});

const { definePartsStyle: definePartsStyleCheckbox, defineMultiStyleConfig: defineMultiStyleConfigCheckbox } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyleCheckbox = definePartsStyleCheckbox({
  control: {
    w: 4,
    h: 4,
    svg: {
      w: 3,
      h: 3,
    },
    border: "1.5px solid",
    borderColor: "background.border",
    bg: "none",
    _checked: {
      bg: "brand.primaryDark",
      _hover: {
        bg: "brand.primaryDark",
      },
    },
    _focusVisible: {
      boxShadow: "none",
      outline: "none",
    },
  },
});

export const Checkbox = defineMultiStyleConfigCheckbox({
  baseStyle: baseStyleCheckbox,
});

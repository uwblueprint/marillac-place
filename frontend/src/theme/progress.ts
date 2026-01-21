import { progressAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(progressAnatomy.keys);

const baseStyle = definePartsStyle({
  track: {
    bg: "primary.100",
  },
  filledTrack: {
    bg: "primary.700",
  },
});

export const Progress = defineMultiStyleConfig({
  baseStyle,
});
import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "0",
  bg: "purple.main",
  color: "white",
  _hover: { bg: "purple.100", color: "purple.main" },
});

const secondary = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "0",
  bg: "purple.100",
  color: "purple.main",
  _hover: { bg: "gray.200" },
});

const cancel = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid #C5C8D8",
  bg: "white",
  _hover: { bg: "gray.200" },
});

const del = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  bg: "white",
  color: "#E30000",
  variant: "outline",
  border: "2px solid #C5C8D8",
});

const buttonTheme = defineStyleConfig({
  variants: { primary, secondary, cancel, del },
});

export default buttonTheme;

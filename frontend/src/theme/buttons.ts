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
  border: "2px solid",
  borderColor: "purple.main",
  bg: "purple.100",
  color: "purple.main",
  _hover: { bg: "purple.main", color: "white" },
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

const success = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid #0D8312",
  bg: "green.100",
  color: "green.main",
  _hover: { bg: "green.main", color: "green.100" },
});

const error = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid #D34C5C",
  bg: "red.100",
  color: "red.main",
  _hover: { bg: "red.main", color: "red.100" },
});

const buttonTheme = defineStyleConfig({
  variants: { primary, secondary, cancel, del, success, error },
});

export default buttonTheme;

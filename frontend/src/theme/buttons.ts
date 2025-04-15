import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "0",
  bg: "orange.500",
  color: "orange.50",
  _hover: {
    bg: "orange.50",
    color: "orange.500",
  },
});
const primaryInactive = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid",
  borderColor: "grey.50",
  bg: "white",
  color: "orange.main",
  _hover: {
    bg: "orange.100",
    color: "orange.main",
  },
});

const secondary = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid",
  borderColor: "teal.main",
  bg: "teal.100",
  color: "teal.main",
  _hover: { bg: "teal.main", color: "white" },
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

const greenOutline = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid teal.main",
  color: "teal.main",
});

const redOutline = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid #D34C5C",
  color: "#D34C5C",
});

const comment = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  bg: "transparent",
  color: "blue",
  textAlign: "left",
  alignSelf: "flex-start",
  marginLeft: "-5",
  border: "2px solid transparent",
  display: "block",
});

const buttonTheme = defineStyleConfig({
  variants: {
    primary,
    primaryInactive,
    secondary,
    cancel,
    del,
    success,
    error,
    redOutline,
    greenOutline,
    comment,
  },
});

export default buttonTheme;

import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const primary = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "0",
  bg: "secondary.700",
  color: "secondary.100",
  _hover: {
    bg: "secondary.100",
    color: "secondary.700",
  },
});
const primaryInactive = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid",
  borderColor: "grey.50",
  bg: "white",
  color: "secondary.700",
  _hover: {
    bg: "secondary.100",
    color: "secondary.700",
  },
});

const secondary = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid",
  borderColor: "primary.700",
  bg: "primary.100",
  color: "primary.700",
  _hover: { bg: "primary.700", color: "white" },
});

const cancel = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid #C5C8D8",
  bg: "white",
  _hover: { bg: "neutral.200" },
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
  border: "2px solid success.800",
  borderColor: "success.800",
  bg: "success.background",
  color: "success.700",
  _hover: { bg: "success.700", color: "success.100" },
});

const error = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid #D34C5C",
  bg: "danger.100",
  color: "danger.700",
  _hover: { bg: "danger.700", color: "danger.100" },
});

const greenOutline = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid primary.700",
  color: "primary.700",
});

const redOutline = defineStyle({
  height: "34px",
  borderRadius: "8px",
  padding: "4px 16px",
  border: "2px solid danger.700",
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

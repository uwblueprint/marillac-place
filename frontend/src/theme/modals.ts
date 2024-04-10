import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  header: {
    padding: "0",
    display: "flex",
    justifyContent: "space-between",
    textAlign: "center",
  },
  overlay: {
    bg: "#00000040",
  },
  dialogContainer: {},
  dialog: {
    minW: "668px",
    borderRadius: "16px",
    bg: `white`,
    boxShadow: "0px 4px 8px 0px #00000040",
    padding: "36px 40px",
  },
  body: {
    padding: "15px 0px 0px 0px",
  },
  footer: {
    padding: "0",
  },
});

const modalTheme = defineMultiStyleConfig({
  baseStyle,
});

export default modalTheme;

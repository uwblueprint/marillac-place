import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
  baseStyle: {
    fontFamily: "Nunito",
  },
  variants: {
    primaryFilled: {
      borderRadius: "8px",
      padding: "8px 24px",
      bg: "#E67D4F",
      color: "#FFFFFF",
      cursor: "pointer",
      _hover: {
        bg: "#D76A3B",
      },
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
    primaryOutline: {
      borderRadius: "8px",
      border: "1px",
      borderColor: "#E67D4F",
      padding: "8px 24px",
      bg: "#FFFFFF",
      color: "#E67D4F",
      cursor: "pointer",
      _hover: {
        border: "0px",
        color: "#FFFFFF",
        bg: "#D76A3B",
      },
      _active: {
        border: "0px",
        color: "#FFFFFF",
        bg: "#E67D4F",
      },
      _disabled: {
        opacity: 0.5,
        border: "0px",
        color: "#FFFFFF",
        bg: "#E67D4F",
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
    secondaryFilled: {
      borderRadius: "8px",
      padding: "8px 24px",
      bg: "#0C727E",
      color: "#FFFFFF",
      cursor: "pointer",
      _hover: {
        bg: "#065761",
      },
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
    secondaryOutline: {
      borderRadius: "8px",
      border: "1px",
      borderColor: "#0C727E",
      padding: "8px 24px",
      bg: "#FFFFFF",
      color: "#0C727E",
      cursor: "pointer",
      _hover: {
        border: "0px",
        color: "#FFFFFF",
        bg: "#065761",
      },
      _active: {
        border: "0px",
        color: "#FFFFFF",
        bg: "#0C727E",
      },
      _disabled: {
        opacity: 0.5,
        border: "0px",
        color: "#FFFFFF",
        bg: "#0C727E",
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
    white: {
      borderRadius: "8px",
      border: "1px",
      borderColor: "#C5C8D8",
      padding: "8px 24px",
      bg: "#FFFFFF",
      color: "#000000",
      cursor: "pointer",
      _hover: {
        bg: "#F5F6F8",
      },
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
        pointerEvents: "none",
      },
    },
  },
});

export default Button;

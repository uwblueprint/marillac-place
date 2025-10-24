import { defineStyleConfig } from '@chakra-ui/react';

export const Text = defineStyleConfig({
  baseStyle: {
    fontFamily: "Nunito",
    color: "#000000",
    margin: 0,
    padding: 0,
  },
});

export const textStyles = {
  web: {
    h1: {
      fontWeight: "700",
      fontSize: "32px",
    },
    h2: {
      fontWeight: "700",
      fontSize: "24px",
    },
    h3: {
      fontWeight: "700",
      fontSize: "20px",
    },
    s1: {
      fontWeight: "700",
      fontSize: "12px",
    },
    b1: {
      fontWeight: "400",
      fontSize: "16px",
    },
    b2: {
      fontWeight: "400",
      fontSize: "14px",
    },
    b3: {
      fontWeight: "400",
      fontSize: "12px",
    },
    c1: {
      color: "#808080",
      fontWeight: "400",
      fontSize: "14px",
    },
    label: {
      fontWeight: "500",
      fontSize: "16px",
      textTransform: "uppercase",
    },
  },
  mobile: {
    h1: {
      fontWeight: "700",
      fontSize: "20px",
    },
    h2: {
      fontWeight: "600",
      fontSize: "16px",
    },
    h3: {
      fontWeight: "600",
      fontSize: "14px",
    },
    s1: {
      color: "#808080",
      fontWeight: "600",
      fontSize: "12px",
    },
    b1: {
      fontWeight: "400",
      fontSize: "14px",
    },
    b2: {
      fontWeight: "400",
      fontSize: "10px",
    },
    b3: {
      fontWeight: "400",
      fontSize: "12px",
    },
    c1: {
      color: "#808080",
      fontWeight: "400",
      fontSize: "12px",
    },
    label: {
      fontWeight: "500",
      fontSize: "14px",
      textTransform: "uppercase",
    },
  },
};

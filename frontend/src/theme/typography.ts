import { defineStyleConfig } from "@chakra-ui/react";

/**
 * Typography Structure
 * 
 * - h: heading
 * - s: subtitle
 * - b: body
 */

export const Text = defineStyleConfig({
  baseStyle: {
    fontFamily: "Nunito",
    color: "text.dark",
    margin: 0,
    padding: 0,
  },
});

export const textStyles = {
  h1: { 
    fontWeight: "700",
    fontSize: "26px",
  },
  h2: { 
    fontWeight: "700",
    fontSize: "24px",
  },
  h3: {
    fontWeight: "700",
    fontSize: "20px",
  },
  h4: {
    fontWeight: "700",
    fontSize: "16px",
  },
  s1: {
    fontWeight: "650",
    fontSize: "14px",
  },
  s2: {
    fontWeight: "650",
    fontSize: "12px",
  },
  b1: {
    fontWeight: "400",
    fontSize: "14px",
  },
  b2: {
    fontWeight: "400",
    fontSize: "12px",
  },
};

import { extendTheme } from "@chakra-ui/react";
import colors from "../theme/colors";
import { Text, textStyles } from "../theme/typography";
import Button from "../theme/buttons";
import { Select, Input } from "../theme/form";

export default function getChakraTheme() {
  const theme = extendTheme({
    colors,
    textStyles,
    components: {
      Button,
      Text,
      Input,
      Select,
    },
  });

  return theme;
};
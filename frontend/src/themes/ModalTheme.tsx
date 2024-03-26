import { modalAnatomy as parts } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(parts.keys);
    
const baseStyle = definePartsStyle({
    overlay: {
        bg: '#00000040'
    },
    dialogContainer: {
        // maxW: '668px',
    },
    dialog: {
        minW: '668px',
        borderRadius: '16px',
        bg: `white`,
        boxShadow: '0px 4px 8px 0px #00000040',
        padding: '36px 40px'
    },
});

const modalTheme = defineMultiStyleConfig({
    baseStyle,
})


export default modalTheme;

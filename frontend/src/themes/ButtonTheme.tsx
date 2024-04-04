import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const primary = defineStyle({
    height: '34px', 
    borderRadius: '8px',
    padding: '4px 16px',
    border: '0',
    bg: '#57469D',
    color: 'white',
});

const clear = defineStyle({
    height: '34px', 
    borderRadius: '8px',
    padding: '4px 16px',
    border: '2px solid #C5C8D8',
    bg: 'white',
});

const del = defineStyle({
    height: '34px', 
    borderRadius: '8px',
    padding: '4px 16px',
    bg: 'white',
    color: '#E30000',
    variant: 'outline',
    border: '2px solid #C5C8D8'
});

const icon = defineStyle({
    bg: 'transparent',
    height: '34px'
});

const buttonTheme = defineStyleConfig({
    variants: { primary, clear, del, icon },
});

export default buttonTheme;

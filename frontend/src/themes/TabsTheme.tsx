import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

// define the base component styles
const horizontalVariant = definePartsStyle({
  // define the part you're going to style
  tab: {
    height: '27px',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '0',
    padding: '27px 12px 20px 12px',
    _selected: {
        color: '#57469D',
        borderColor: '#57469D',
        borderWidth: '0 0 3px 0',
    },
  },
  tablist: {
    height: '50px',
    borderColor: '#C5C8D8',
    borderWidth: '0 0 3px 0',
    bg: '#F9F7FF',
    paddingLeft: '40px',
    gap: '40px'
    // display: 'flex',
    // alignItems: 'flex-end',
    // justifyContent: 'space-between',
  },
})

const variants = {
    horizontal: horizontalVariant,
}
// export the component theme
const tabsTheme = defineMultiStyleConfig({ variants })

export default tabsTheme;
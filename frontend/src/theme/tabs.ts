import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const horizontalVariant = definePartsStyle({
  tab: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "0",
    marginTop: "25px",
    _selected: {
      color: "primary.700",
      borderColor: "primary.700",
      borderWidth: "0 0 3px 0",
    },
  },
  tablist: {
    height: "60px",
    borderColor: "neutral.300",
    borderWidth: "0 0 3px 0",
    bg: "primary.100",
  },
});

const variants = {
  horizontal: horizontalVariant,
};

const tabsTheme = defineMultiStyleConfig({ variants });

export default tabsTheme;

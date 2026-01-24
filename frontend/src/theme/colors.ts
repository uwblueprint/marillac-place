/**
 * Color Structure
 *
 * - brand: marillac's main colors.
 * - background: the whites and greys for pages, popups, tables, etc.
 * - indicate: colors for success/error/warning/informational UI.
 * - schedule dark/light: all of the colors that are used within the schedule
 * - text: standard font colors
 */

const colors = {
  brand: {
    primaryDark: "#0C727E",
    primaryLight: "#E3ECEB",
    secondaryDark: "#E67D4F",
    secondaryLight: "#FCF2ED",
  },
  background: {
    admin: "#FFFFFF",
    participant: "#FDFDFD",
    highlight: "#F8F8F8",
    border: "#C5C8D8",
  },
  indicate: {
    darkRed: "#B21D2F",
    brightRed: "#E30000",
    deepGreen: "#259E29",
    lightGreen: "#EAFFEB",
  },
  schedule: {
    assignedDark: "#255B9A",
    incompleteDark: "#B21D2F",
    excusedDark: "#B07D18",
    completeDark: "#0D8312",
    assignedLight: "#C5DCF8",
    incompleteLight: "#F8D7DB",
    excusedLight: "#FFE5B2",
    completeLight: "#CDEECE",
  },
  text: {
    dark: "#000000",
    medium: "#626262",
    light: "#808080",
  },
};

export default colors;

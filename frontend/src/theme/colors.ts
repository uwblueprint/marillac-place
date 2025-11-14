/**
 * Color Structure
 * 
 * - brand: Marillac's main colors.
 * - background: the greys.
 * - indicate: colors for success/error/warning/informational UI.
 * - schedule dark/light: all of the colors that are used within the calendar
 */
const colors = {
  brand: {
    orange: "#E67D4F",
    teal: "#0C727E",
  },
  background: {
    white: "#FFFFFF", // Admin/relief background
    participantBg: "#FAFAFA", // Participant background
    tableBg: "#F5F6F8",
    header: "#E3ECEB", // used for page headers, room cards, and login page background
    border: "#C5C8D8",
  },
  indicate: {
    signOut: "#B21D2F",
    darkGreen: "#0D8312",
    brightGreen: "#1BB421",
    lightGreen: "#EAFFEB",
  },
  scheduleDark: {
    blue: "#255B9A",
    red: "#B21D2F",
    yellow: "#B07D18",
    green: "#0D8312",
  },
  scheduleLight: {
    blue: "#C5DCF8",
    yellow: "#FFE5B2",
    green: "#CDEECE",
    red: "#F8D7DB",
  },
  text: {
    light: {
      primary: "#1D2433",
      secondary: "#595D67",
      disabled: "#6C707A",
    },
    dark: {
      primary: "#FFFFFF",
      secondary: "#B5B5B8",
      disabled: "#8B8C8F",
    },
  },
};

export default colors;

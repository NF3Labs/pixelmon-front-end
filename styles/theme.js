import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#FFFFFF", "#01071A")(props),
        color: mode("#000000", "#FFFFFF")(props),
      },
    }),
  },
  colors: {
    bg: {
      dark: "#01071A",
      light: "#FFFFFF"
    },
    lightBg: {
      dark: "rgba(255, 255, 255, 0.1)",
      light: "#F1F1F1"
    },
    content: {
      dark: "#C4C4D4",
      light: "#696869"
    },
    header: {
      dark: "#1a1f30",
      light: "#BCBCBC"
    },
    input: {
      dark: "#ffffff",
      light: "#696869"
    },
    primary: "#01071A",
    secondary: "#ffffff",
    pinker: "#FF0083",
    greener: "#4ACB53",
    grayer: "rgba(255, 255, 255, 0.2)",
    oranger: "#FF2E00",
    pinkerHover: "#FF008350",
    whiteHover: "#ffffffb0",
    bluer: "#F2E6E0",
    title: {
      dark: "#ffffff",
      light: "#000000"
    },
    titleHover: {
      dark: "#ffffff50",
      light: "#00000050"
    },
    placeholder: {
      dark: "#C4C4D4",
      light: "#BCBCBC"
    }
  },
  components: {
    Alert: {
      variants: {
        // define own toast variant
        toast: (props) => ({
          container: {
            border: mode("2px solid black", "2px solid white")(props),
            bg: mode("#FFFFFF", "#1A1429")(props),
          },
        }),
      },
    },
  },
});

export default theme;

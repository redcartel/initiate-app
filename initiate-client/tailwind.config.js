import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {},
    colors: {
      primary: colors.amber,
      secondary: colors.cyan,
      tertiary: colors.slate,
      action: colors.emerald,
      destructive: colors.red,
      disabled: colors.zinc,
      blue: colors.blue,
    },
    fontFamily: {
      sans: ["Roboto", defaultTheme.fontFamily.sans],
      serif: ["Patua One", defaultTheme.fontFamily.serif],
      title: ["Patua One", defaultTheme.fontFamily.serif],
    },
  },
  safelist: [
    {
      pattern:
        /(bg|text|border|ring|outline)-(primary|secondary|tertiary|action|destructive|disabled)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: [
        "hover",
        "focus",
        "active",
        "disabled",
        "group-hover",
        "group-focus",
        "group-active",
        "group-disabled",
      ],
    },
    {
      pattern: /text-(xsm|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|10xl)/,
      variants: [
        "hover",
        "focus",
        "active",
        "disabled",
        "group-hover",
        "group-focus",
        "group-active",
        "group-disabled",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
        "7xl",
        "8xl",
        "9xl",
        "10xl",
      ],
    },
  ],
};

// console.log(JSON.stringify(config, null, 2));

export default config;

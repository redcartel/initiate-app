/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Albert Sans", "sans-serif"],
      },
      maxWidth: {
        112: "28rem",
      },
    },
  },
  plugins: [],
};

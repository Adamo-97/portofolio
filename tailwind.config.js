/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        cornflowerblue: {
          100: "#18a1fd",
          200: "#0087e3",
          300: "rgba(0, 135, 227, 0.1)",
          400: "rgba(24, 161, 253, 0.1)",
        },
        black: "#000",
        gray: {
          100: "rgba(255, 255, 255, 0.7)",
          200: "rgba(255, 255, 255, 0.5)",
          300: "rgba(255, 255, 255, 0.1)",
        },
        lightgray: "#d0d5dd",
        silver: "#b5bdc4",
        dimgray: "#656565",
        darkslategray: "rgba(52, 52, 52, 0.5)",
        darkslateblue: {
          100: "rgba(0, 68, 130, 0.1)",
          200: "rgba(0, 68, 130, 0)",
        },
        steelblue: "rgba(14, 96, 151, 0)",
      },
      fontFamily: {
        urbanist: "Urbanist",
      },
    },
    screens: {},
  },
  corePlugins: {
    preflight: false,
  },
};

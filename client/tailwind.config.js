/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6c45c0",
        secondary: "#e086e3",
        accent: "#f9c1f9",
        background: "#ffffff",
        text: "#333333",
        dark: "#16161d",
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
        heading: ["Arial Black", "Arial", "sans-serif"],
      },
      fontSize: {
        base: "16px",
        h1: "48px",
        h2: "36px",
        h3: "24px",
        h4: "18px",
        h5: "16px",
        h6: "14px",
      },
      lineHeight: {
        base: "1.5",
      },
      spacing: {
        1: "8px",
        2: "16px",
        3: "24px",
        4: "32px",
        5: "40px",
        6: "48px",
        7: "56px",
        8: "64px",
        9: "72px",
        10: "80px",
      },
      boxShadow: {
        primary: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        secondary: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      borderColor: {
        DEFAULT: "#ebebeb",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
  },
  plugins: [],
}

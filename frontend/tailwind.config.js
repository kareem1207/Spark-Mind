/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Early Spark Color Palette
        "early-spark": {
          navy: "#2e4156", // Primary dark color
          teal: "#587c90", // Secondary accent
          "sky-blue": "#c7d9e5", // Light accent
          beige: "#f3efec", // Background/neutral
          white: "#ffffff", // Pure white
        },
        // Map common color names to Early Spark palette
        primary: {
          50: "#f0f4f7",
          100: "#dae7ee",
          200: "#b8d1e0",
          300: "#87b3cc",
          400: "#587c90", // teal
          500: "#2e4156", // navy (main primary)
          600: "#273649",
          700: "#212c3c",
          800: "#1e2632",
          900: "#1d222b",
        },
        secondary: {
          50: "#f8fbfc",
          100: "#eef6f9",
          200: "#c7d9e5", // sky-blue
          300: "#9cc3d4",
          400: "#6ba7c2",
          500: "#587c90", // teal (main secondary)
          600: "#4a6b7c",
          700: "#3f5967",
          800: "#374b55",
          900: "#304048",
        },
        neutral: {
          50: "#f3efec", // beige
          100: "#e8e2de",
          200: "#d1c7bf",
          300: "#b5a699",
          400: "#998974",
          500: "#7d6e5c",
          600: "#675949",
          700: "#54493d",
          800: "#463e35",
          900: "#3c352f",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #2e4156 0%, #587c90 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #587c90 0%, #c7d9e5 100%)",
        "gradient-neutral": "linear-gradient(135deg, #f3efec 0%, #ffffff 100%)",
      },
    },
  },
  plugins: [],
};

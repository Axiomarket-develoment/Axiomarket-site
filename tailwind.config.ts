// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],     // default body
        heading: ["Poppins", "sans-serif"], // custom for headings
      },
    },
  },
  plugins: [],
};

export default config;
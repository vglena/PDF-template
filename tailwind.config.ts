import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#f4f5f7",
        accent: "#b3002d",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#F4EFE6",
        card: "#FFFDF9",
        ink: "#141413",
        neoDark: "#1A1A1A",
        amberGold: "#FFB800",
        vibrantAmber: "#F5A623",
        warmYellow: "#FEF3C7",
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        neo2: "2px 2px 0px #1A1A1A",
        neo3: "3px 3px 0px #1A1A1A",
        neo4: "4px 4px 0px #1A1A1A",
        neo5: "5px 5px 0px #1A1A1A",
        neo8: "8px 8px 0px #1A1A1A",
      },
    },
  },
  plugins: [],
};
export default config;

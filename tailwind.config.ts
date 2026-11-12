import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf6f0",
          100: "#d0ebe0",
          200: "#a6d9c4",
          300: "#74c1a3",
          400: "#45a581",
          500: "#299E72", // Fresh green
          600: "#176B4D", // Forest green
          700: "#13583f",
          800: "#114634",
          900: "#0e3a2b",
          950: "#052018",
        },
        surface: {
          light: "#F7F9F6",
          card: "#FFFFFF",
          border: "#E4EAE5",
          dark: "#0C1411",
          darkCard: "#14211B",
          darkElevated: "#1B2C24",
          darkBorder: "#23392E",
        },
        charcoal: {
          DEFAULT: "#202B27",
          muted: "#748078",
          light: "#97A39B",
          dark: "#ECF4EE",
          darkMuted: "#96A99E",
        },
        warning: {
          DEFAULT: "#D99A32",
          light: "#FEF7E9",
          dark: "#F4B54F",
        },
        danger: {
          DEFAULT: "#C85B5B",
          light: "#FDF0F0",
          dark: "#E36F6F",
        },
        mint: {
          light: "#E7F5EE",
          dark: "#163428",
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -2px rgba(18, 43, 33, 0.05), 0 1px 3px -1px rgba(18, 43, 33, 0.03)",
        card: "0 4px 20px -2px rgba(18, 43, 33, 0.06), 0 2px 6px -2px rgba(18, 43, 33, 0.04)",
        cardHover: "0 10px 30px -4px rgba(18, 43, 33, 0.1), 0 4px 10px -2px rgba(18, 43, 33, 0.06)",
        darkCard: "0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -2px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;

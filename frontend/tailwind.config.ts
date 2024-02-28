import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./ui_components/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        dmSans: ["DM Sans", "sans-serif"],
        kalam: ["Kalam", "cursive"],
        roboto: ["Roboto", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "2rem",
          xl: "2rem",
          "2xl": "6rem",
        },
      },
      screens: {
        xs: "440px",
        sm: "600px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        xxl: "1536px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        transparent: "transparent",
        neonGreen: "#38F18D",
        primary: {
          50: "#F7FDFB",
          100: "#EBFAF2",
          300: "#ADECCA",
          600: "#32CF7A",
          800: "#1E7C49",
          1000: "#0A2918",
        },
        secondary: {
          50: "#FFFFFF",
          100: "#EAEBEA",
          300: "#AAADAC",
          500: "#555B59",
          600: "#2B322F",
          800: "#1A1E1C",
        },
        text: {
          1000: "#090A09",
          700: "#222826",
          500: "#555B59",
          300: "#AAADAC",
          50: "#FFFFFF",
          primary: "#32CF7A",
          primaryDark: "#1E7C49",
          primaryDarker: "#0A2918",
          black: "#0F0F0F",
        },
        error: {
          100: "#FEF2F2",
          300: "FECACA",
          500: "#DC2626",
          800: "800E00",
        },
        warning: {
          100: "#FEFCE8",
          300: "#FEF9C3",
          500: "#DE9804",
          800: "#61450C",
        },
        success: {
          100: "#F0FDF4",
          300: "#BBF7D0",
          500: "#16A34A",
          800: "#22542B",
        },
        link: {
          100: "#E0F2FE",
          300: "#BAE6FD",
          500: "#0EA5E9",
          800: "#002C4D",
        },
        bg: {
          50: "#FFFFFF",
          100: "#FBFBFB",
          tint: "#F7FDFB",
          bannerGradient: "linear-gradient(239.5deg, #A8FF63 12.72%, #FFDD2A 88.29%)",
        },
        backgroundImage: {
          blackGradient: "linear-gradient(133.34deg, #4F4F4F -7.78%, #000000 105.43%)",
          blueGradient: "linear-gradient(133.34deg, #1A9EFF -7.78%, #007EDB 105.43%)",
          purpleGradient: "linear-gradient(133.34deg, #5448B9 -7.78%, #4A25C6 105.43%)",
          pinkGradient: "linear-gradient(133.34deg, #FF1A51 -7.78%, #DB0091 105.43%)",
          orangeGradient: "linear-gradient(310.83deg, #CD5959 -5.07%, #CC703C 97.49%)",
          profileGradient: "linear-gradient(310.83deg, #090A09 80%, #090A09 0%)",
        },
      },
    },
    variants: {
      extend: {
        display: ["group-hover"],
      },
      boxShadow: ["responsive", "hover", "focus"],
    },
    corePlugins: {
      backdropOpacity: false,
      backgroundOpacity: false,
      borderOpacity: false,
      divideOpacity: false,
      ringOpacity: false,
      textOpacity: false,
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

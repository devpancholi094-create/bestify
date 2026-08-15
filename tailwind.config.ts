import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        paper: {
          DEFAULT: "hsl(var(--paper))",
          dark: "hsl(var(--paper-dark))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          soft: "hsl(var(--ink-soft))",
        },
        clover: {
          50: "#f2f6ef",
          100: "#e1ead9",
          200: "#c5d6b6",
          300: "#a2bc8c",
          400: "#82a468",
          500: "#5f7f47",
          600: "#4a6537",
          700: "#3b4f2c",
          800: "#2f3f24",
          900: "#28351f",
        },
        rosewood: {
          50: "#fbf1ee",
          100: "#f5ddd5",
          200: "#eabcae",
          300: "#dc9481",
          400: "#c96c53",
          500: "#a8503a",
          600: "#8d3f2c",
          700: "#713424",
          800: "#5c2c20",
          900: "#4c261c",
        },
        mustard: {
          50: "#fbf6e8",
          100: "#f4e6bd",
          200: "#eacf83",
          300: "#deb04a",
          400: "#c8912a",
          500: "#a7741f",
          600: "#875c1a",
          700: "#6c481a",
          800: "#583b1a",
          900: "#4a3219",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        paper: "0 1px 2px rgba(40,30,20,0.06), 0 8px 24px -8px rgba(40,30,20,0.18)",
        sticker: "0 6px 16px -4px rgba(40,30,20,0.35)",
        tape: "0 2px 4px rgba(0,0,0,0.12)",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "flutter-in": {
          "0%": { opacity: "0", transform: "translateY(10px) rotate(-3deg) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(0deg) scale(1)" },
        },
        "pin-drop": {
          "0%": { opacity: "0", transform: "translateY(-14px) scale(0.9)" },
          "60%": { opacity: "1", transform: "translateY(2px) scale(1.02)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flutter-in": "flutter-in 0.45s cubic-bezier(0.16,1,0.3,1)",
        "pin-drop": "pin-drop 0.5s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

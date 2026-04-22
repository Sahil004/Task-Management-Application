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
        purple: "#6e73ff",
        teal: "#3ecfb8",
        pink: "#ff6e9c",
        ink: "#18181b",
        "bg-base": "var(--bg)",
        "bg-card": "var(--bg-card)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        glow: "0 0 24px rgba(110,115,255,0.25)",
        "glow-teal": "0 0 24px rgba(62,207,184,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease both",
        "fade-in": "fadeIn 0.3s ease both",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        pulseSoft: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.6" } },
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "emerald-deep": "#022c22",
        "emerald-rich": "#064e3b",
        "emerald-glow": "#10b981",
        "gold-metallic": "#D4AF37",
        "gold-shine": "#FFDF00",
        "gold-soft": "#F9E2AF",
        "primary": "#11d473",
        "background-light": "#f6f8f7",
        "background-dark": "#102219",
        "emerald-custom": "#065f46",
        "gold-custom": "#d4af37",
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "spin-slow": "spin 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
}

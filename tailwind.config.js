/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rust: {
          black: "#080909",
          panel: "#111412",
          panel2: "#181d19",
          line: "#2c302a",
          orange: "#c56b32",
          amber: "#e5a147",
          metal: "#9ca4a0",
          green: "#7f9f62",
        },
      },
      boxShadow: {
        rust: "0 18px 70px rgba(0, 0, 0, 0.42)",
        ember: "0 0 32px rgba(197, 107, 50, 0.18)",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

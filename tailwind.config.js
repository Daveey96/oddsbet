/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        c1: "#1a1fa4",
        c2: "#06b6d4",
        c3: "#00000b",
        c4: "#0e1219",
      },
      fontFamily: {
        kanit: ["kanit", "sans-serif"],
      },
      fontSize: {
        120: "120%",
        115: "115%",
        110: "110%",
        105: "105%",
        100: "100%",
        95: "95%",
        90: "90%",
        85: "85%",
        80: "80%",
        75: "75%",
      },
      borderRadius: {
        inh: "inherit",
      },
      fill: {
        inh: "inherit",
      },
    },
  },
  plugins: [],
};

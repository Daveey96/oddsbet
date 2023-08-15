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
      screens: {
        xs: "410px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1238px",
      },
      colors: {
        c1: "#1a1fa4",
        c2: "#06b6d4",
        c3: "#e6e6e6",
        c4: "#0e1219",
        c5: "#d2d2d2",
      },

      borderRadius: {
        inh: "inherit",
      },
    },
  },
  plugins: [],
};

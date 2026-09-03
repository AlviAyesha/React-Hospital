/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        background: "#09090b",
        surface: "#18181b",
        muted: "#a1a1aa",
      }
    },
  },
  plugins: [],
}

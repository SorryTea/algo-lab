/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg:      '#0c0a14',
          surface: '#141020',
          elevated:'#1e1830',
          border:  '#2d2550',
          text:    '#ede8ff',
          muted:   '#9088bb',
        },
      },
    },
  },
  plugins: [],
}
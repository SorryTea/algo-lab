/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg:      'rgb(var(--ob-bg) / <alpha-value>)',
          surface: 'rgb(var(--ob-surface) / <alpha-value>)',
          elevated:'rgb(var(--ob-elevated) / <alpha-value>)',
          border:  'rgb(var(--ob-border) / <alpha-value>)',
          text:    'rgb(var(--ob-text) / <alpha-value>)',
          muted:   'rgb(var(--ob-muted) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
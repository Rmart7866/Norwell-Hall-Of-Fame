/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'norwell-blue': '#1e3a8a',
        'norwell-gold': '#fbbf24',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          blue: '#1976d2',
          lightBlue: '#e3f2fd',
          highlight: '#bbdefb',
          darkBg: '#121824',
          darkCard: '#1a2233',
          darkGrid: '#253046',
          darkText: '#f1f5f9',
          selected: '#90caf9',
          tileBg: '#fef7e0',
          tileBorder: '#ebd7a1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


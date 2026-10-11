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
        brand: {
          blue: '#2563eb',
          blueDark: '#1d4ed8',
          blueLight: '#3b82f6',
          bgLight: '#f8fafc',
          bgCard: '#ffffff',
          green: '#10b981',
          red: '#ef4444',
          purple: '#8b5cf6',
          teal: '#06b6d4',
          amber: '#f59e0b',
        },
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
        display: ['-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}

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
        sans: ['"Cormorant Garamond"', '"EB Garamond"', 'Garamond', '"Times New Roman"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', '"EB Garamond"', 'Garamond', '"Times New Roman"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', '"EB Garamond"', 'Garamond', '"Times New Roman"', 'Georgia', 'serif'],
        mono: ['"Cormorant Garamond"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '11.5': '2.875rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '26': '6.5rem',
      }
    },
  },
  plugins: [],
}

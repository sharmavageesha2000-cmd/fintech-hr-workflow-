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
        fintech: {
          navy: {
            950: '#040814',
            900: '#070d1e',
            850: '#0c152e',
            800: '#111d3d',
            700: '#1a2b56',
          },
          blue: {
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            accent: '#06b6d4',
          },
          emerald: {
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 30px -5px rgba(37, 99, 235, 0.35)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.35)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'card-light': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      }
    },
  },
  plugins: [],
}

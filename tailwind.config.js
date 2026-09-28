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
        pdf24: {
          blue: '#1e3a8a',
          lightBlue: '#eff6ff',
          sky: '#3b82f6',
          orange: '#ff6600',
          orangeHover: '#e65c00',
          yellow: '#fbbf24',
          green: '#10b981',
          grayBg: '#f8fafc',
          borderDashed: '#60a5fa'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        cursive: ['Caveat', 'Dancing Script', 'Pacifico', 'cursive']
      }
    },
  },
  plugins: [],
}

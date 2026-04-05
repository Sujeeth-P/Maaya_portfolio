/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0A0A0A',
        white: '#FAFAF7',
        cream: '#F4F1E8',
        teal: {
          DEFAULT: '#0D9E75',
          light: '#E1F5EE',
          dark: '#085041',
        },
        'warm-gray': '#8A8880',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.02em',
      },
    },
  },
  plugins: [],
}

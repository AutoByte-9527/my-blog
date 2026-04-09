/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F0',
        foreground: '#2D2D2D',
        primary: '#2D2D2D',
        accent: '#8B4513',
        muted: '#6B6B6B',
      },
    },
  },
  plugins: [],
}

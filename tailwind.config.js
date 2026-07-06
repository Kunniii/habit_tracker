/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "SF Pro Display", "Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
        mono: ['"Geist Mono"', '"SF Mono"', '"JetBrains Mono"', 'monospace'],
        playwrite: ['"Playwrite BE VLG"', 'cursive'],
      },
      colors: {
        canvas: '#FBFBFA',
        surface: '#FFFFFF',
        ink: '#111111',
        muted: '#787774',
        border: '#EAEAEA',
        accent: {
          blue: { bg: '#E1F3FE', text: '#1F6C9F' },
          green: { bg: '#EDF3EC', text: '#346538' },
          red: { bg: '#FDEBEC', text: '#9F2F2D' },
          yellow: { bg: '#FBF3DB', text: '#956400' },
        }
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

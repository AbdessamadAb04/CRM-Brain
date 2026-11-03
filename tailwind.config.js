/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg1: '#060d1f', bg2: '#0b1629', bg3: '#0f1e38', bg4: '#162240',
        b1: '#1e3356', b2: '#243d66',
        sfblue: '#00a3e0', sfamber: '#f59e0b', sfgreen: '#10b981',
        sfpurple: '#8b5cf6', sfred: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

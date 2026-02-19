/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDF6E3',
        parchment: '#F5EDD6',
        'paper-dark': '#EDE0C4',
        'pencil-gray': '#4A4A4A',
        'ink-blue': '#2C5F8A',
        'soft-blue': '#7EB3D4',
        'rule-line': '#D4C5A9',
        'signed-green': '#4CAF50',
      },
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        noto: ['Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        notebook: '2px 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.4)',
        page: '0 2px 8px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

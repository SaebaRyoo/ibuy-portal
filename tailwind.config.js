module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {},
      boxShadow: {
        '3xl': '0 0 10px 3px rgba(0,0,0,0.08)',
      },
      colors: { cPink: '#f76c68' },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    './public/index.html',
  ],
  safelist: [
    'text-orange-500',
    'text-pink-500',
    'text-blue-500',
    'text-green-500',
    '[&>*:nth-child(1)]:bg-sky-100'
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}


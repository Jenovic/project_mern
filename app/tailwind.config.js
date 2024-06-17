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
    '[&>*:nth-child(1)]:bg-sky-100',
    '[&>*:nth-child(2)]:bg-sky-100',
    '[&>*:nth-child(3)]:bg-sky-100',
    '[&>*:nth-child(4)]:bg-sky-100',
    '[&>*:nth-child(5)]:bg-sky-100',
    '[&>*:nth-child(6)]:bg-sky-100',
    '[&>*:nth-child(7)]:bg-sky-100',
    '[&>*:nth-child(8)]:bg-sky-100',
    '[&>*:nth-child(9)]:bg-sky-100',
    '[&>*:nth-child(10)]:bg-sky-100',
    '[&>*:nth-child(11)]:bg-sky-100',
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '90rem',
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}


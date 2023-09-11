/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    theme: {
      extend: {
        colors: {
          "loginColor" : "#4A40BF", 
          "mainText" : "#77DFF8",
          "mainp" : "#ADAABA"
        },
      },
    },
  plugins: [],
  },
}

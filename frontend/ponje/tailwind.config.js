module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#4E40F4",
          "secondary": "#77DFF8",

        },
      },
    ],
  },
  plugins: [require('daisyui')],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    theme: {
      extend: {
        colors: {
          loginColor: "#4A40BF",
          mainText: "#77DFF8",
          mainp: "#ADAABA",
        },
      },
    },
    darkMode: "class",
  },
};
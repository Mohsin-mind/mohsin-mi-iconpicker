/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '25': '0.25', // 25% of the original size
        '75': '0.75', // 75% of the original size
        '175': '1.75', // 175% of the original size
        '200': '2', // 200% of the original size
      },
    },
  },
  plugins: [],
}


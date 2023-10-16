/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    },
    text: {
      'blue': '#091F5B',

    }
  },

  plugins: [
    // eslint-disable-next-line no-undef
    require('tailwind-scrollbar-hide')
  ]
}


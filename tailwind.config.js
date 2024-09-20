/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'l-background': '#f3f4f6',
        'd-background': '#121827',
        'l-primary': '#6f4ed7',
        'd-primary': '#6f4ed7',
        'l-secondary': '#354154',
        'd-secondary': '#354154',
        'l-text': '#202937',
        'd-text': '#e3e8f0',
      }
    }
  },
  plugins: [require('daisyui')],
  darkMode: 'class'
}
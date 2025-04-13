/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5288c1',
        secondary: '#4eadd8',
        success: '#4caf50',
        neutral: {
          100: '#f5f5f5',
          200: '#f0f0f0',
          300: '#e9f0f7',
          700: '#666666',
          900: '#333333',
        },
      },
      borderRadius: {
        'xl': '15px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
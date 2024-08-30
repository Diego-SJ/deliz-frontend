/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#1e293b',
        background: '#F5F8FA',
        foregraound: '#FFFFFF',
      },
    },
  },
  plugins: [],
};

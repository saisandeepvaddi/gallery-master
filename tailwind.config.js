/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontSize: {
      base: '16px',
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
    },
    extend: {
      fontSize: {
        base: '16px',
        xs: '14px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
        '6xl': '56px',
        '7xl': '64px',
        '8xl': '72px',
        '9xl': '80px',
        '10xl': '88px',
      },
    },
  },
  plugins: [],
};

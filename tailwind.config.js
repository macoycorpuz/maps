/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px',
    },
    extend: {
      colors: {
        primary: {
          100: 'var(--primary-100)',
          300: 'var(--primary-300)',
          500: 'var(--primary-500)',
          700: 'var(--primary-700)',
          900: 'var(--primary-900)',
        },
        secondary: {
          100: 'var(--secondary-100)',
          300: 'var(--secondary-300)',
          500: 'var(--secondary-500)',
          700: 'var(--secondary-700)',
          900: 'var(--secondary-900)',
        },
        tertiary: {
          300: 'var(--tertiary-300)',
          500: 'var(--tertiary-500)',
          700: 'var(--tertiary-700)',
          900: 'var(--tertiary-900)',
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      ringWidth: ['hover', 'active'],
      ringColor: ['hover', 'active'],
      ringOffsetWidth: ['hover', 'active'],
      fontWeight: ['hover', 'focus'],
      borderRadius: ['hover', 'focus'],
      borderWidth: ['hover', 'focus'],
      visibility: ['hover', 'focus'],
    },
  },
  plugins: [],
};

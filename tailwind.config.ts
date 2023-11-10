import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'violet-eggplant': {
          '50': '#fef3ff',
          '100': '#fae6ff',
          '200': '#f6ccff',
          '300': '#f1a3ff',
          '400': '#eb6dff',
          '500': '#dd36ff',
          '600': '#c515e4',
          '700': '#a70ebd',
          '800': '#970fa9',
          '900': '#74117e',
          '950': '#4d0055',
        },
      },
      colors: {
        'violet-eggplant': {
          '50': '#fef3ff',
          '100': '#fae6ff',
          '200': '#f6ccff',
          '300': '#f1a3ff',
          '400': '#eb6dff',
          '500': '#dd36ff',
          '600': '#c515e4',
          '700': '#a70ebd',
          '800': '#970fa9',
          '900': '#74117e',
          '950': '#4d0055',
        },
      },
      boxShadow: {
        right:
          '8px 0 15px -3px rgba(0, 0, 0, 0.1), 4px 0 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;

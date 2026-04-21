import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#101828',
        sand: '#f6efe4',
        clay: '#d97757',
        pine: '#0f766e',
        dusk: '#1d4ed8',
        butter: '#f4c95d',
      },
      boxShadow: {
        panel: '0 22px 60px rgba(16, 24, 40, 0.12)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};

export default config;

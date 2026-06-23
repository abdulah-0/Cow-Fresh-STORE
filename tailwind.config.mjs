import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cow Fresh brand tokens from PRD
        'cf-green': 'var(--cf-green)',
        'cf-navy': 'var(--cf-navy)',
        'cf-sky': 'var(--cf-sky)',
        'cf-off-white': 'var(--cf-off-white)',
        'cf-charcoal': 'var(--cf-charcoal)',
        'cf-white': 'var(--cf-white)',
        // Semantic colors
        'primary': 'var(--cf-green)',
        'primary-foreground': 'var(--cf-white)',
        'secondary': 'var(--cf-navy)',
        'secondary-foreground': 'var(--cf-white)',
        'accent': 'var(--cf-sky)',
        'accent-foreground': 'var(--cf-navy)',
        'background': 'var(--cf-off-white)',
        'foreground': 'var(--cf-charcoal)',
        'card': 'var(--cf-white)',
        'card-foreground': 'var(--cf-charcoal)',
        'popover': 'var(--cf-white)',
        'popover-foreground': 'var(--cf-charcoal)',
        'muted': 'var(--cf-off-white)',
        'muted-foreground': 'var(--cf-charcoal)',
        'destructive': 'var(--cf-navy)',
        'destructive-foreground': 'var(--cf-white)',
        'border': 'var(--cf-sky)',
        'input': 'var(--cf-sky)',
        'ring': 'var(--cf-green)',
      },
      fontFamily: {
        heading: ['Poppins', 'var(--font-geist-sans)', 'sans-serif'],
        body: ['Inter', 'var(--font-geist-mono)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} as Config;
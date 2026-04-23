/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0f1117',
        'bg-surface': '#1a1d27',
        'bg-elevated': '#22263a',
        'border-default': '#2e3347',
        'text-primary': '#e8eaf0',
        'text-secondary': '#8b90a7',
        'accent-blue': '#4f8ef7',
        'accent-green': '#34d399',
        'accent-amber': '#fbbf24',
        'accent-purple': '#a78bfa',
        'accent-red': '#f87171',
        'canvas-bg': '#13161f',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}


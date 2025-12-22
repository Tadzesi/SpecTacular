/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          bg: {
            primary: '#0d1117',
            secondary: '#161b22',
            tertiary: '#21262d',
          },
          text: {
            primary: '#e6edf3',
            secondary: '#8b949e',
            muted: '#6e7681',
          },
          border: '#30363d',
          accent: {
            blue: '#6c9eff',
            purple: '#c792ea',
            green: '#7ed6a5',
          }
        },
        // Light theme colors
        light: {
          bg: {
            primary: '#ffffff',
            secondary: '#f6f8fa',
            tertiary: '#eaeef2',
          },
          text: {
            primary: '#1f2937',
            secondary: '#57606a',
            muted: '#8b949e',
          },
          border: '#d0d7de',
          accent: {
            blue: '#0969da',
            purple: '#8250df',
            green: '#1a7f37',
          }
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        '200': '200ms',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

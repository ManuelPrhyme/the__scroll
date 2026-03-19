import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      colors: {
        scroll: {
          bg: '#FFFFFF',
          fg: '#242424',
          muted: '#6B6B6B',
          accent: '#1A8917',
          border: '#E6E6E6',
          surface: '#F9F9F9',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        article: '720px',
      },
    },
  },
  plugins: [],
} satisfies Config;

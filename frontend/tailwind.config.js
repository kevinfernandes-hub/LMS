/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // New palette for light mode
        primary: {
          DEFAULT: '#142047', // Deep navy
          dark: '#0d1530',
          light: '#22306b',
        },
        accent: {
          DEFAULT: '#142047',
          50: '#e6eaf3',
          100: '#cfd7e6',
          200: '#b7c3d9',
          500: '#142047',
          600: '#101a38',
          900: '#0d1530',
        },
        bg: {
          page: '#fff',
          surface: '#f8f9fb',
          elevated: '#f3f4f8',
        },
        border: {
          DEFAULT: '#d1d5db',
          strong: '#bfc5ce',
        },
        text: {
          900: '#142047',
          700: '#22223b',
          600: '#444e5e',
          400: '#6b7280',
        },
        // Semantic colors (unchanged)
        success: {
          DEFAULT: '#10B981',
          light: '#064E3B',
          border: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#78350F',
          border: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#7F1D1D',
          border: '#DC2626',
        },
        info: {
          DEFAULT: '#6366F1',
          light: '#312E81',
          border: '#4F46E5',
        },
        // Course colors (adjusted for new palette)
        course: {
          violet: { bg: '#142047', border: '#22306b' },
          blue: { bg: '#1e3a8a', border: '#3B82F6' },
          emerald: { bg: '#064E3B', border: '#10B981' },
          amber: { bg: '#78350F', border: '#F59E0B' },
          rose: { bg: '#831843', border: '#F43F5E' },
          slate: { bg: '#334155', border: '#94A3B8' },
        },
        // Light mode overrides  
        light: {
          'bg-page': '#F6F5FF',
          'bg-surface': '#FFFFFF',
          'bg-elevated': '#F8F7FF',
          'border': '#E8E6F0',
          'text-900': '#1A1523',
          'text-600': '#6E6A7C',
          'text-400': '#A89FBC',
          'accent': '#7C5CFC',
        },
      },
      fontFamily: {
        display: ['Cabinet Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        h1: ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        h2: ['16px', { lineHeight: '1.4', letterSpacing: '-0.005em', fontWeight: '600' }],
        h3: ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        body: ['14px', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '400' }],
        sm: ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        micro: ['11px', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '500', textTransform: 'uppercase' }],
      },
      borderRadius: {
        xs: '6px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
      },
      spacing: {
        ...Object.fromEntries([[0, '0'], [1, '4px'], [2, '8px'], [3, '12px'], [4, '16px'], [5, '20px'], [6, '24px'], [8, '32px'], [12, '48px'], [16, '64px']].map(([k, v]) => [k, v])),
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 2px 8px rgba(124, 92, 252, 0.35)',
        lg: '0 4px 16px rgba(124, 92, 252, 0.08)',
        xl: '0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        card: '0 1px 2px rgba(124, 92, 252, 0.3), 0 0 0 0px rgba(124, 92, 252, 0)',
        'card-hover': '0 4px 16px rgba(124, 92, 252, 0.08)',
        'modal': '0 24px 64px rgba(26, 21, 35, 0.15), 0 4px 16px rgba(26, 21, 35, 0.08)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'spin-fast': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'spin-fast': 'spin-fast 0.8s linear infinite',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [],
}

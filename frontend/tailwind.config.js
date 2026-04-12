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
        // Base palette
        bg: {
          page: '#F6F5FF',
          surface: '#FFFFFF',
          elevated: '#F8F7FF',
        },
        border: {
          DEFAULT: '#E8E6F0',
          strong: '#D0CCE8',
        },
        text: {
          900: '#1A1523',
          600: '#6E6A7C',
          400: '#A89FBC',
        },
        // Accent - Violet
        accent: {
          50: '#F3F0FF',
          100: '#E5DEFF',
          200: '#C9BBFF',
          500: '#7C5CFC',
          600: '#6644F4',
          900: '#2D1F6E',
        },
        // Semantic colors
        success: {
          DEFAULT: '#10B981',
          light: '#F0FDF4',
          border: '#A7F3D0',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
          border: '#FDE68A',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FFF1F2',
          border: '#FECDD3',
        },
        info: {
          DEFAULT: '#6366F1',
          light: '#EEF2FF',
          border: '#C7D2FE',
        },
        // Course colors (muted)
        course: {
          violet: { bg: '#EDE9FE', border: '#7C3AED' },
          blue: { bg: '#EFF6FF', border: '#3B82F6' },
          emerald: { bg: '#ECFDF5', border: '#10B981' },
          amber: { bg: '#FFFBEB', border: '#F59E0B' },
          rose: { bg: '#FFF1F2', border: '#F43F5E' },
          slate: { bg: '#F8FAFC', border: '#64748B' },
        },
        // Dark mode overrides
        dark: {
          'bg-page': '#0F0D17',
          'bg-surface': '#18162A',
          'bg-elevated': '#1F1D30',
          'border': '#2E2A42',
          'text-900': '#F0EEFF',
          'text-600': '#9B93B3',
          'text-400': '#5E5773',
          'accent': '#8B6FFD',
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

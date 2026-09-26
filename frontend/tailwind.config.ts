import type { Config } from 'tailwindcss';

/* Shape is fixed by design/SAMJO_DESIGN_TO_CODE_MAPPING.md §1.
   Arbitrary values in class names are a lint error: add a token first. */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: { DEFAULT: 'var(--surface)', subtle: 'var(--surface-subtle)' },
        ink: {
          DEFAULT: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          subtle: 'var(--primary-subtle)',
        },
        'on-primary': 'var(--on-primary)',
        'action-edge': 'var(--action-edge)',
        warning: { DEFAULT: 'var(--warning)', surface: 'var(--warning-surface)' },
        danger: { DEFAULT: 'var(--danger)', surface: 'var(--danger-surface)' },
        success: { DEFAULT: 'var(--success)', surface: 'var(--success-surface)' },
        hairline: 'var(--border)',
        'hairline-strong': 'var(--border-strong)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: { measure: '68ch', shell: 'var(--header-shell-width)' },
      height: {
        header: 'var(--header-height-desktop)',
        'header-sm': 'var(--header-height-mobile)',
        'header-lg': 'var(--header-height-lg)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: { subtle: 'var(--shadow-subtle)', medium: 'var(--shadow-medium)' },
      screens: {
        xs: '320px',
        sm: '390px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
  },
  plugins: [],
} satisfies Config;

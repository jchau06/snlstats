// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { designTokens } from './design-tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors from design tokens
      colors: {
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
        tertiary: designTokens.colors.tertiary,
        neutral: designTokens.colors.neutral,
        
        success: designTokens.colors.success,
        warning: designTokens.colors.warning,
        danger: designTokens.colors.danger,
        info: designTokens.colors.info,
        
        text: designTokens.colors.text,
        bg: designTokens.colors.background,
        border: designTokens.colors.border,
      },

      // Font families from design tokens
      fontFamily: {
        heading: designTokens.typography.fontFamily.heading,
        subheading: designTokens.typography.fontFamily.subheading,
        accent: designTokens.typography.fontFamily.accent,
        mono: designTokens.typography.fontFamily.mono,
        sans: designTokens.typography.fontFamily.body,
      },

      // Font sizes from design tokens
      fontSize: {
        h1: [designTokens.typography.fontSize.h1.size, {
          fontWeight: designTokens.typography.fontSize.h1.weight,
          lineHeight: designTokens.typography.fontSize.h1.lineHeight,
        }],
        h2: [designTokens.typography.fontSize.h2.size, {
          fontWeight: designTokens.typography.fontSize.h2.weight,
          lineHeight: designTokens.typography.fontSize.h2.lineHeight,
        }],
        h3: [designTokens.typography.fontSize.h3.size, {
          fontWeight: designTokens.typography.fontSize.h3.weight,
          lineHeight: designTokens.typography.fontSize.h3.lineHeight,
        }],
        h4: [designTokens.typography.fontSize.h4.size, {
          fontWeight: designTokens.typography.fontSize.h4.weight,
          lineHeight: designTokens.typography.fontSize.h4.lineHeight,
        }],
        lg: [designTokens.typography.fontSize.lg.size, {
          fontWeight: designTokens.typography.fontSize.lg.weight,
          lineHeight: designTokens.typography.fontSize.lg.lineHeight,
        }],
        base: [designTokens.typography.fontSize.base.size, {
          fontWeight: designTokens.typography.fontSize.base.weight,
          lineHeight: designTokens.typography.fontSize.base.lineHeight,
        }],
        sm: [designTokens.typography.fontSize.sm.size, {
          fontWeight: designTokens.typography.fontSize.sm.weight,
          lineHeight: designTokens.typography.fontSize.sm.lineHeight,
        }],
        xs: [designTokens.typography.fontSize.xs.size, {
          fontWeight: designTokens.typography.fontSize.xs.weight,
          lineHeight: designTokens.typography.fontSize.xs.lineHeight,
        }],
        stat: [designTokens.typography.fontSize.stat.size, {
          fontWeight: designTokens.typography.fontSize.stat.weight,
          lineHeight: designTokens.typography.fontSize.stat.lineHeight,
        }],
      },

      // Spacing from design tokens
      spacing: {
        xs: designTokens.spacing.xs,
        sm: designTokens.spacing.sm,
        md: designTokens.spacing.md,
        lg: designTokens.spacing.lg,
        xl: designTokens.spacing.xl,
        xxl: designTokens.spacing.xxl,
        xxxl: designTokens.spacing.xxxl,
      },

      // Border radius from design tokens
      borderRadius: {
        none: designTokens.borderRadius.none,
        sm: designTokens.borderRadius.sm,
        md: designTokens.borderRadius.md,
        lg: designTokens.borderRadius.lg,
        xl: designTokens.borderRadius.xl,
        full: designTokens.borderRadius.full,
      },

      // Box shadows from design tokens
      boxShadow: {
        none: designTokens.shadow.none,
        sm: designTokens.shadow.sm,
        md: designTokens.shadow.md,
        lg: designTokens.shadow.lg,
        xl: designTokens.shadow.xl,
        gold: designTokens.shadow.gold,
      },

      // Transition timing from design tokens
      transitionDuration: {
        fast: designTokens.transition.fast,
        base: designTokens.transition.base,
        slow: designTokens.transition.slow,
      },

      // Z-index from design tokens
      zIndex: designTokens.zIndex,

      // Opacity from design tokens
      opacity: {
        light: designTokens.opacity.light,
        medium: designTokens.opacity.medium,
        dark: designTokens.opacity.dark,
        darker: designTokens.opacity.darker,
      },
    },
  },
  plugins: [],
};

export default config;
// design-tokens.ts - Central design system for snlstats.net

export const designTokens = {
  // Color palette
  colors: {
    primary: '#FFD200',      // Gold - accents, highlights
    secondary: '#222222',    // Near-black - backgrounds, dark elements
    tertiary: '#FFFFFF',     // White - text, light elements
    neutral: '#0A0A0A',      // True black - depth, darkest backgrounds
    
    // Extended palette for semantic use
    success: '#1D9E75',      // Teal - positive indicators
    warning: '#BA7517',      // Amber - caution, secondary highlights
    danger: '#E24B4A',       // Red - negative indicators, errors
    info: '#185FA5',         // Blue - informational
    
    // Semantic neutrals
    text: {
      primary: '#FFFFFF',    // White text on dark
      secondary: '#B4B2A9',  // Muted text
      tertiary: '#5F5E5A',   // Very muted
      inverse: '#0A0A0A',    // Dark text on light (rare)
    },
    
    background: {
      primary: '#0A0A0A',    // Main dark background
      secondary: '#222222',  // Elevated surfaces
      tertiary: '#2C2C2A',   // Cards, panels
    },
    
    border: {
      primary: '#FFD200',    // Gold borders
      secondary: '#5F5E5A',  // Muted borders
      tertiary: '#2C2C2A',   // Subtle borders
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      heading: '"Acme Gothic", sans-serif',        // Main headings (h1, h2)
      subheading: '"Gotham Bold", sans-serif',     // Subheadings (h3, h4)
      accent: '"Budmo Jiggler", sans-serif',       // Stats, data highlights
      mono: '"JetBrains Mono", monospace',         // Statistical labels, code
      body: '"Hanken Grotesk", sans-serif',        // Body text, general content
    },
    
    fontSize: {
      // Headings (Acme Gothic / Budmo Jiggler)
      h1: { size: '48px', weight: 700, lineHeight: 1.1 },
      h2: { size: '36px', weight: 700, lineHeight: 1.2 },
      h3: { size: '28px', weight: 700, lineHeight: 1.3 },
      h4: { size: '24px', weight: 700, lineHeight: 1.3 },
      
      // Body text (Hanken Grotesk)
      lg: { size: '18px', weight: 400, lineHeight: 1.6 },
      base: { size: '16px', weight: 400, lineHeight: 1.6 },
      sm: { size: '14px', weight: 400, lineHeight: 1.5 },
      xs: { size: '12px', weight: 400, lineHeight: 1.4 },
      
      // Stat labels (JetBrains Mono)
      stat: { size: '16px', weight: 500, lineHeight: 1.4 },
      statSmall: { size: '12px', weight: 500, lineHeight: 1.4 },
      
      // Subheadings (Gotham Bold)
      subheading: { size: '20px', weight: 700, lineHeight: 1.3 },
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
      black: 900,
    },
  },
  
  // Spacing system (8px base unit)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  // Border radius
  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    none: 'none',
    sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
    md: '0 4px 8px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.4)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.5)',
    gold: '0 0 24px rgba(255, 210, 0, 0.3)',  // Glowing gold effect
  },
  
  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  // Breakpoints
  breakpoints: {
    xs: '360px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  
  // Z-index scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    offcanvas: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Opacity scale for overlays
  opacity: {
    light: '0.15',
    medium: '0.3',
    dark: '0.5',
    darker: '0.7',
  },
};

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type ColorKey = keyof typeof designTokens.colors;
export type SpacingKey = keyof typeof designTokens.spacing;
export type BorderRadiusKey = keyof typeof designTokens.borderRadius;
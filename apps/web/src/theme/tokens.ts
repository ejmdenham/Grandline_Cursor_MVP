/**
 * Named Grandline design tokens for the admin web app.
 * Values match Grandline_Design.md. New UI must import these roles, not scaffolding hex.
 */

export const color = {
  ink: '#1C1917',
  stone: '#78716C',
  dusk: '#4A433C',
  paper: '#FAFAF9',
  sand: '#F5F0EB',
  haze: '#F0E4D4',
  clay: '#CDB9A2',
  ember: '#E85D04',
  emberInk: '#FFF7ED',
  mark: '#15803D',
  flare: '#C2410C',
  hairline: '#E7E5E4',
  mapLand: '#E8DFD4',
  mapWater: '#C9D4D0',
  mapPark: '#D5DCC8',
} as const;

export const text = {
  primary: color.ink,
  secondary: color.stone,
  onAccent: color.emberInk,
  accent: color.ember,
  success: color.mark,
  danger: color.flare,
} as const;

export const bg = {
  page: color.sand,
  muted: color.sand,
  accent: color.ember,
  inverse: color.ink,
  surface: color.paper,
  canvas: color.haze,
} as const;

export const border = {
  default: color.hairline,
  strong: color.dusk,
  accent: color.ember,
} as const;

export const space = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 16,
  hud: 12,
  pill: 999,
} as const;

export const size = {
  touch: 40,
  compact: 32,
} as const;

export const inset = {
  hud: 16,
  sheet: 20,
} as const;

export const weight = {
  regular: '400',
  semibold: '600',
  bold: '700',
} as const;

export const type = {
  time: {
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1.2,
    fontWeight: weight.bold,
  },
  placement: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.8,
    fontWeight: weight.bold,
  },
  title: { fontSize: 20, lineHeight: 26, fontWeight: weight.semibold },
  action: { fontSize: 16, lineHeight: 22, fontWeight: weight.semibold },
  body: { fontSize: 16, lineHeight: 22, fontWeight: weight.regular },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: weight.regular },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    fontWeight: weight.semibold,
  },
  adminTitle: { fontSize: 18, lineHeight: 24, fontWeight: weight.semibold },
  adminBody: { fontSize: 14, lineHeight: 20, fontWeight: weight.regular },
  adminMeta: { fontSize: 12, lineHeight: 16, fontWeight: weight.regular },
} as const;

export const fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Grandline ease: arrives fast, settles, no bounce. Prefer 80–280ms. */
export const easeGrandline = 'cubic-bezier(0.2, 0.9, 0.2, 1)';

export const motion = {
  ease: easeGrandline,
  easeBezier: [0.2, 0.9, 0.2, 1] as const,
  pressIn: 80,
  pressOut: 160,
  focus: 120,
} as const;

export const opacity = {
  hud: 0.82,
  sheet: 0.96,
  press: 0.88,
} as const;

/** CSS custom properties from tokens.css — prefer for stylesheets. */
export const cssVar = {
  ink: 'var(--color-ink)',
  stone: 'var(--color-stone)',
  dusk: 'var(--color-dusk)',
  paper: 'var(--color-paper)',
  sand: 'var(--color-sand)',
  haze: 'var(--color-haze)',
  clay: 'var(--color-clay)',
  ember: 'var(--color-ember)',
  emberInk: 'var(--color-ember-ink)',
  mark: 'var(--color-mark)',
  flare: 'var(--color-flare)',
  hairline: 'var(--color-hairline)',
  easeGrandline: 'var(--ease-grandline)',
} as const;

export const tokens = {
  color,
  text,
  bg,
  border,
  space,
  radius,
  size,
  inset,
  type,
  fontFamily,
  easeGrandline,
  motion,
  opacity,
  cssVar,
} as const;

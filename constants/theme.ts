// theme.ts — single source of truth for colors, spacing, typography.
// Every screen should import from here instead of hardcoding hex values.
// This is what makes an app look like ONE product instead of several
// screens built at different times with slightly different colors.

export const colors = {
  // Brand
  primary:       '#6366F1',   // indigo — buttons, links, active states
  primaryLight:  '#EEF2FF',   // light indigo — badges, backgrounds
  primaryDark:   '#4F46E5',   // pressed/darker state

  // Accent colors (used for section highlights)
  accentPink:    '#EC4899',
  accentGreen:   '#10B981',
  accentOrange:  '#F59E0B',

  // Status
  danger:        '#EF4444',
  dangerLight:   '#FEF2F2',
  success:       '#10B981',

  // Neutrals (text)
  textPrimary:   '#111827',   // headings, important text
  textSecondary: '#6B7280',   // body text, descriptions
  textTertiary:  '#9CA3AF',   // labels, placeholders, meta info
  textDisabled:  '#D1D5DB',

  // Neutrals (backgrounds & borders)
  bgScreen:      '#F9FAFB',   // default screen background
  bgCard:        '#FFFFFF',   // card / elevated surface background
  bgSubtle:      '#F3F4F6',   // subtle fills, dividers, disabled bg
  border:        '#E5E7EB',

  white:         '#FFFFFF',
  black:         '#000000',
};

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm:  8,
  md:  12,
  lg:  14,
  xl:  16,
  xxl: 20,
  round: 999,
};

export const typography = {
  h1:      { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.3 },
  h2:      { fontSize: 20, fontWeight: '700' as const },
  h3:      { fontSize: 17, fontWeight: '700' as const },
  body:    { fontSize: 14, fontWeight: '500' as const },
  bodySm:  { fontSize: 13, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  label:   { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.5 },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
};
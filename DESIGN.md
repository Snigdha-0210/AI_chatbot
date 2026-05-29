---
name: Aetheric Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#f5ff7d'
  on-secondary: '#2f3300'
  secondary-container: '#d7e404'
  on-secondary-container: '#5d6400'
  tertiary: '#a7caf3'
  on-tertiary: '#063254'
  tertiary-container: '#7194bb'
  on-tertiary-container: '#002b4c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#dfed1a'
  secondary-fixed-dim: '#c3d000'
  on-secondary-fixed: '#1b1d00'
  on-secondary-fixed-variant: '#454a00'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#a7caf3'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#25496c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  surface-deep: '#08090a'
  surface-card: '#1e293b'
  accent-indigo-glow: rgba(99, 102, 241, 0.15)
  notion-blue: '#0535C2'
  notion-orange: '#FF8A33'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button-text:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 280px
  container-max: 1440px
  gutter: 24px
  margin-page: 40px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 48px
---

## Brand & Style

The design system is engineered for a professional, desktop-first AI SaaS experience that balances academic rigor with futuristic efficiency. The brand personality is "The Intellectual Navigator"—authoritative, sophisticated, yet incredibly fast. 

The aesthetic leverages **Modern Minimalism** infused with **Glassmorphism**. It prioritizes a high density of information without clutter, utilizing "dark mode" as the flagship experience to evoke the feeling of a high-end IDE or professional creative suite. Key visual motifs include subtle indigo-tinted glows to represent AI processing, ultra-thin borders, and a rigorous adherence to a structured grid.

## Colors

The palette is anchored in a deep, layered dark mode. The primary Indigo (`#6366f1`) provides a modern, energetic tech feel, while the Tertiary Light Blue (`#B2D5FF`) is reserved for subtle text highlights and informational accents. The Secondary Lime (`#E4F222`) acts as a surgical strike color—used exclusively for high-priority calls to action or "new" AI features.

In Dark Mode, surfaces use a hierarchical stack: 
- **Base:** Deep Neutral (`#0f172a`)
- **Panels/Sidebar:** Surface Deep (`#08090a`)
- **Cards/Elevated:** Surface Card (`#1e293b`)

Light Mode transitions to high-contrast clarity using clean whites and soft grays, retaining the Indigo as the primary functional color.

## Typography

This design system uses **Geist** for all primary interfaces to maintain a precise, developer-centric aesthetic. Headlines feature aggressive negative letter-spacing and heavy weights to command attention.

For technical metadata, AI-generated code snippets, or institutional data points, **JetBrains Mono** is utilized at small scales (12px) with all-caps styling and increased letter spacing. This creates a clear visual distinction between human-readable content and system-generated logic.

## Layout & Spacing

The layout is a **fixed-sidebar multi-column grid**. The sidebar (280px) remains persistent for navigation, while the main content area utilizes a 12-column fluid grid within a 1440px max-width container.

**Spacing Rhythm:**
- Use a strictly base-8 rhythm (8, 16, 24, 48) for vertical spacing between sections.
- For internal card padding, use 24px (`unit-lg`) to ensure the "spacious" feeling requested.
- Desktop-first reflow: On tablet, the sidebar collapses into a drawer, and margins reduce from 40px to 24px.

## Elevation & Depth

This design system eschews traditional heavy shadows in favor of **Tonal Layering** and **Glassmorphism**.

1.  **Level 0 (Background):** Solid `#0f172a`.
2.  **Level 1 (Panels):** Surface Deep with a 1px border of `rgba(255,255,255,0.05)`.
3.  **Level 2 (Cards):** Surface Card with a subtle 4px blur backdrop and a `1px` top-light border to simulate a physical edge.
4.  **Floating Elements (Modals/Menus):** High-opacity glassmorphism (80% saturation, 20px blur) with a primary-tinted "glow" shadow (`rgba(99, 102, 241, 0.2)`) that appears only on interaction or focus.

## Shapes

The shape language is defined by **Rounded-XL (16px)** corners for primary containers and cards, which softens the "technical" feel of the dark mode. 

- **Primary Buttons:** Pill-shaped (3rem) to distinguish them from structural elements.
- **Input Fields/Chips:** Standard 8px (`rounded-md`) for a more utilitarian, compact appearance.
- **Selection States:** Use a 4px inner radius for indicators to maintain a nested appearance within larger containers.

## Components

**Buttons:**
Primary buttons use the Indigo palette with a subtle `box-shadow` glow. Secondary buttons use a "ghost" style—transparent with a 1px border. Hover states should feature a 5% increase in lightness and a smooth 200ms transition.

**Cards:**
All cards must feature a 1px border (`rgba(255,255,255,0.1)`) and 24px padding. In AI-active states, the border should animate into a subtle indigo-to-purple gradient.

**Inputs:**
Text inputs are dark-themed with a focus state that triggers a 2px indigo border and a subtle internal glow. Use `label-mono` for field titles to maintain the professional SaaS aesthetic.

**Chips/Badges:**
Small, low-contrast capsules. Status indicators (e.g., "AI Processing") should include a pulse animation using the primary color.

**Sidebar:**
The sidebar should utilize a slightly darker background than the main content (`#08090a`) to ground the interface. Active navigation items use a vertical indigo bar on the left edge and a subtle background tint.
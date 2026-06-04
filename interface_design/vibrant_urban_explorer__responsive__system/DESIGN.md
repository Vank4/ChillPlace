---
name: Vibrant Urban Explorer
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#594139'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#8d7168'
  outline-variant: '#e1bfb5'
  surface-tint: '#ab3500'
  primary: '#ab3500'
  on-primary: '#ffffff'
  primary-container: '#ff6b35'
  on-primary-container: '#5f1900'
  inverse-primary: '#ffb59d'
  secondary: '#35618d'
  on-secondary: '#ffffff'
  secondary-container: '#a2cdff'
  on-secondary-container: '#2a5782'
  tertiary: '#006b5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#00ac9b'
  on-tertiary-container: '#003832'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832600'
  secondary-fixed: '#d1e4ff'
  secondary-fixed-dim: '#a0cafc'
  on-secondary-fixed: '#001d35'
  on-secondary-fixed-variant: '#184974'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for a high-energy, social-mapping hybrid that prioritizes immediate visual impact and seamless navigation. The brand personality is **exuberant, kinetic, and community-driven**, targeting a Gen-Z and Millennial audience that communicates through media and location-based discovery.

The design style is **Modern Corporate with a High-Contrast Edge**. It leverages the structural reliability of professional SaaS platforms but injects "vibe-heavy" elements like oversized typography, saturated accents, and generous border radii. The interface must feel "fast"—meaning low cognitive load, high-contrast touch targets, and a clear hierarchy that guides the user toward the next social interaction or physical destination.

## Colors

The palette is designed for high-energy interaction and clarity.

- **Primary Orange (#FF6B35):** Used for "Heat." It signifies action, trending content, and primary CTAs. It should be the most prominent color on the screen to drive conversion.
- **Trust Blue (#1F4E79):** Provides the "Anchor." Used for structural elements like headers, nav bars, and professional data overlays to ensure the platform feels reliable and secure.
- **Location Teal (#14B8A6):** Specifically reserved for the "Map & Discovery" ecosystem. It signals spatial information, pin drops, and success states.
- **Neutral/Surface:** A cool-toned off-white (#F8FAFC) is used for the background to let media content pop, while pure #FFFFFF is used for foreground cards and containers.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, modern, and slightly geometric characteristics. 

- **Headlines:** Use Bold and ExtraBold weights with tight letter spacing to create a "loud" editorial feel. 
- **Body:** Kept at Medium or Regular weights for readability. 
- **Labels:** Small labels for tags and metadata should use SemiBold or Bold weights at 12px-14px to remain legible against vibrant backgrounds.
- **Mobile Scaling:** Headline sizes should scale down significantly for smaller viewports to maintain a 2-3 line maximum for titles.

## Layout & Spacing

The layout is **Mobile-First**, utilizing a 4-column grid for mobile and a 12-column fluid grid for desktop. 

- **The 8px Rhythm:** All spacing must be a multiple of 8px. Use 16px (md) for standard padding and 24px (lg) for section separation.
- **Map View:** Should occupy the full viewport with floating UI elements (glassmorphic or solid) anchored to the edges with 16px margins.
- **Content Containers:** Use a "Safe Area" margin of 16px on mobile and 32px on desktop to ensure content doesn't feel cramped against the screen edges.

## Elevation & Depth

To maintain the "High-Energy" feel without clutter, this design system uses **Tonal Layers** combined with **Ambient Shadows**.

- **Level 0 (Base):** Background color #F8FAFC.
- **Level 1 (Cards):** Surface color #FFFFFF with a soft, diffused shadow (0px 4px 20px rgba(31, 78, 121, 0.08)).
- **Level 2 (Floating/Interactive):** Floating Action Buttons (FABs) and active overlays use a slightly more aggressive shadow with a hint of the primary color (0px 8px 24px rgba(255, 107, 53, 0.15)).
- **Depth Cues:** Interaction is signaled by "lifting" elements on hover or press, increasing shadow spread rather than darkening the color.

## Shapes

The shape language is defined by **Extreme Rounding**. This softens the high-contrast color palette and makes the UI feel approachable and "bubbly."

- **Standard Elements:** Buttons and Inputs use `rounded-lg` (16px).
- **Media Cards:** Photos and Video containers use `rounded-2xl` (24px) or `rounded-xl` (20px).
- **Interactive Badges:** Use a pill-shape (full rounding) to differentiate them from functional buttons.

## Components

### Buttons
- **Primary:** Background #FF6B35, Text #FFFFFF, Bold 16px. Large padding (16px 32px).
- **Secondary:** Background #1F4E79, Text #FFFFFF. Used for administrative actions.
- **Ghost:** Transparent background with #1F4E79 border or text. Used for secondary map actions.

### Media-Heavy Cards
Cards are the lifeblood of the system. They should feature a 16:9 or 4:5 aspect ratio image with a 24px corner radius. Overlays (tags, location pins) should sit in the top-left or bottom-right with a subtle backdrop blur.

### Inputs
Search bars and text fields should have a light grey border (#E2E8F0) that turns Primary Orange (#FF6B35) on focus. Include prominent icons (Primary Orange or Trust Blue) for search and location.

### Tag Chips & Badges
- **Trending Tags:** Pill-shaped, Primary Orange background with white text.
- **Location Tags:** Pill-shaped, Location Teal (#14B8A6) background with white text.
- **Categories:** White background with #1F4E79 border and text.

### Navigation
The mobile navigation should be a persistent bottom bar with a floating "Create/Post" button in the center, utilizing the Primary Orange color to draw the eye.
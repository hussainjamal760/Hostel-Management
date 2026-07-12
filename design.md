---
name: Hostelite HMS
colors:
  surface: '#fff8f6'
  surface-dim: '#ead6ce'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#feeae2'
  surface-container-high: '#f8e4dc'
  surface-container-highest: '#f2ded6'
  on-surface: '#231915'
  on-surface-variant: '#504440'
  inverse-surface: '#3a2e29'
  inverse-on-surface: '#ffede6'
  outline: '#82746f'
  outline-variant: '#d4c3bd'
  surface-tint: '#765749'
  primary: '#432a1e'
  on-primary: '#ffffff'
  primary-container: '#5c4033'
  on-primary-container: '#d3ac9c'
  inverse-primary: '#e6bead'
  secondary: '#755849'
  on-secondary: '#ffffff'
  secondary-container: '#fdd5c2'
  on-secondary-container: '#785a4b'
  tertiary: '#1b3434'
  on-tertiary: '#ffffff'
  tertiary-container: '#324b4b'
  on-tertiary-container: '#9fbaba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#e6bead'
  on-primary-fixed: '#2c160b'
  on-primary-fixed-variant: '#5c4033'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#e5bfac'
  on-secondary-fixed: '#2b160b'
  on-secondary-fixed-variant: '#5c4133'
  tertiary-fixed: '#cce8e7'
  tertiary-fixed-dim: '#b0cccb'
  on-tertiary-fixed: '#051f20'
  on-tertiary-fixed-variant: '#324b4b'
  background: '#fff8f6'
  on-background: '#231915'
  surface-variant: '#f2ded6'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  stats-lg:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for a premium hospitality management experience, blending the precision of high-end SaaS with the warmth of boutique hospitality. It targets property owners and managers who value efficiency without sacrificing aesthetic soul.

The visual direction is **Minimal Luxury**. It draws inspiration from modern "Craft SaaS" movements—characterized by expansive whitespace, rigorous typography, and subtle tactile details. The emotional response is one of calm authority; the UI feels like a well-appointed concierge desk rather than a complex database. We utilize a "Warm Minimalist" approach, replacing cold grays with organic tones to create an inviting, human-centric enterprise environment.

## Colors

The palette is rooted in organic, earth-derived tones to distinguish the platform from typical blue-centric SaaS.

- **Primary & Secondary:** Deep Walnut and Coffee provide the structural weight and "Executive" feel for navigation and primary actions.
- **Accent:** Warm Sand is used sparingly for highlights, active states, and premium features.
- **Surfaces:** The system uses a dual-surface strategy. The global background is a Soft Beige (#F8F5F0), while functional containers and cards use Ivory (#FFFCF8) to create a subtle lift.
- **Functional:** Success, Warning, and Error colors are desaturated and shifted toward natural pigments (Olive, Amber, Brick) to maintain the "Warm" brand promise without appearing jarring.

## Typography

This design system uses **Manrope** for its modern, geometric construction that maintains a warmth often missing from traditional grotesques. 

- **Headings:** Large and bold with tight letter-spacing to create a "High-Fashion" editorial feel.
- **Data Tables:** Use `body-sm` for density, but maintain high contrast (Dark Espresso text on Ivory backgrounds) to ensure readability of financial and occupancy data.
- **Labels:** Small caps with slight tracking are used for secondary metadata and table headers to provide clear hierarchy without adding visual weight.

## Layout & Spacing

The layout philosophy is based on a **Spacious Fluid Grid**. We prioritize "Room to Breathe," mimicking the feeling of a luxury hotel lobby.

- **Desktop:** A 12-column grid with a wide 40px outer margin. Gutters are kept at 24px to maintain a tight relationship between related data points while allowing overall sections to feel expansive.
- **Content Density:** In management views (lists/tables), we use `sm` (12px) internal padding. In dashboard and marketing-heavy views, we expand to `md` (24px) or `lg` (48px) to emphasize a premium feel.
- **Mobile:** Transition to a 4-column grid with 16px margins. Complex data tables should utilize horizontal scrolling with frozen first columns to maintain context.

## Elevation & Depth

This design system utilizes **Glassmorphism** and **Tonal Layering** rather than traditional heavy shadows.

- **Surface Strategy:** Background is Soft Beige. Main content containers are Ivory. This 1-step tonal shift provides the primary sense of structure.
- **Glass Effects:** Top navigation bars and sidebars use a semi-transparent blur (Backdrop Filter: 12px) of the surface color to create a sense of depth and modernity.
- **Shadows:** Only used for floating elements (modals, dropdowns). Shadows are long, low-opacity (8-10%), and tinted with the Primary color (#5C4033) to keep them feeling warm and integrated rather than "dirty" gray.
- **Borders:** A 1px solid line in Light Warm Gray (#E6DED3) is the primary method for defining card boundaries.

## Shapes

The shape language is defined by **Soft Geometricism**. 

- **Primary Radius:** 16px (1rem) is the standard for cards, input fields, and primary buttons. This creates a welcoming, non-aggressive interface.
- **Small Elements:** Tooltips and chips use 8px (0.5rem) to maintain visual balance at smaller scales.
- **Interactive States:** Buttons may transition slightly in weight or shadow, but the corner radius remains constant to preserve the geometric integrity of the system.

## Components

- **Buttons:** Primary buttons are Solid Walnut (#5C4033) with White text. Secondary buttons use a Sand (#C9A67B) ghost style with a 1px border. All buttons have 16px rounding and `label-md` typography.
- **Input Fields:** Ivory background with a Warm Gray border. On focus, the border shifts to Warm Sand (#C9A67B) with a subtle 4px outer glow in the same tone.
- **Cards:** Ivory background, 16px radius, and a 1px Light Warm Gray border. Avoid shadows on cards unless they are interactive/hoverable.
- **Status Chips:** Use a "Pill" shape (32px radius). Success uses Olive Green text on a light tinted background; Error uses Brick Red.
- **Data Tables:** Headers are `label-md` in Coffee Brown. Rows have a 1px bottom border. Hover states should use a subtle Soft Beige (#F8F5F0) background tint.
- **Navigation:** The sidebar uses a minimal layout with Coffee Brown icons. Active states are indicated by a vertical bar in Warm Sand and a text weight shift to 600.

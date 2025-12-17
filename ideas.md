# Chrome Extension Onboarding — Neo-Brutalist Design Exploration

## Design Context
A multi-step form wizard for user profile setup with 6 main steps. The design should feel raw, intentional, and efficient—inspired by Speedy Apply's no-nonsense approach while embracing neo-brutalist principles of exposed structure and bold typography.

---

<response>
<probability>0.08</probability>

## Approach 1: Raw Grid Brutalism
**Design Movement:** Neo-Brutalism with Industrial Grid Systems

**Core Principles:**
- Visible grid structure; forms align to strict columns with no apology
- Heavy sans-serif typography (bold weights dominate); minimal hierarchy through size alone
- Monochromatic base with single accent color (electric blue or neon green) for interaction states
- Exposed form structure: borders visible, inputs have thick outlines, no soft shadows

**Color Philosophy:**
- Background: Off-white or light gray (#f5f5f5)
- Text: Deep charcoal (#1a1a1a)
- Accent: Electric blue (#0066ff) or neon green (#00ff00) for CTAs and focus states
- Borders: 2-3px solid black or dark gray
- Rationale: Raw, industrial feel; high contrast ensures readability and intentional visual weight

**Layout Paradigm:**
- Asymmetric two-column layout: form fields on left (60%), progress/info panel on right (40%)
- Thick dividing line between sections
- Form inputs stretch full width with heavy borders
- Progress indicator as a vertical bar with numbered steps

**Signature Elements:**
1. **Bold Typography Block:** Large, all-caps section titles (e.g., "STEP 1: PERSONAL PROFILE") with tracking
2. **Thick Borders & Outlines:** All inputs and buttons have 3px solid borders; no rounded corners (or minimal 2px)
3. **Grid Overlay Aesthetic:** Subtle background grid pattern or aligned spacing that feels structured

**Interaction Philosophy:**
- Click states: Invert colors (white text on blue background)
- Hover: Slight scale increase (1.02x) with border color change
- Focus: Thick outline in accent color, no blur
- Transitions: Instant or 100ms (snappy, no easing)

**Animation:**
- Progress bar fills with a hard line animation (no easing)
- Form field focus: Border color changes instantly
- Button press: Slight inset shadow effect (pressed state)
- Page transitions: Fade in/out at 200ms with no blur

**Typography System:**
- Display: IBM Plex Mono Bold, 32px, all-caps for section titles
- Body: IBM Plex Sans, 16px, regular weight for form labels
- Input: IBM Plex Mono, 14px for form values
- Hierarchy: Weight and size only; no color shifts

</response>

---

<response>
<probability>0.07</probability>

## Approach 2: Minimal Brutalism with Whitespace
**Design Movement:** Scandinavian Brutalism meets Swiss Grid Design

**Core Principles:**
- Extreme whitespace; breathing room between form sections
- Minimal color palette: black, white, and one warm accent (burnt orange or deep red)
- Typography-driven hierarchy; form structure implied through spacing, not borders
- Asymmetric layouts with ragged edges; intentional imperfection

**Color Philosophy:**
- Background: Pure white (#ffffff)
- Text: Black (#000000)
- Accent: Burnt orange (#cc5500) or deep red (#8b0000) for interactive elements
- Subtle dividers: Light gray (#e0e0e0) for section separation
- Rationale: Extreme clarity; every element serves a purpose; warm accent provides human touch

**Layout Paradigm:**
- Single-column centered layout with max-width 500px
- Generous top/bottom padding (48px) between form sections
- Form inputs with bottom border only (no box outline)
- Progress steps displayed as a horizontal line with dots; current step highlighted

**Signature Elements:**
1. **Typographic Emphasis:** Large serif font (Georgia or Garamond) for step titles; sans-serif for body
2. **Minimal Input Design:** Inputs have only bottom border (1px); label floats above on focus
3. **Warm Accent Dots:** Progress indicators as colored circles; current step in burnt orange

**Interaction Philosophy:**
- Hover: Text color shifts to accent color; underline appears
- Focus: Bottom border thickens and changes to accent color
- Click: Slight fade effect (opacity 0.8) then restore
- Transitions: Smooth 300ms cubic-bezier for all state changes

**Animation:**
- Progress indicator: Dot fills with a smooth animation (300ms)
- Form entrance: Stagger each field with 100ms delay; fade in from bottom
- Button press: Subtle scale down (0.98x) with color shift
- Page transitions: Slide in from right at 400ms

**Typography System:**
- Display: Georgia Bold, 36px, for section titles
- Body: Inter, 16px, regular for labels and instructions
- Input: Inter, 16px, for form values
- Hierarchy: Weight, size, and selective color use

</response>

---

<response>
<probability>0.09</probability>

## Approach 3: Dark Brutalism with Neon Accents
**Design Movement:** Cyberpunk Brutalism; Industrial meets Digital

**Core Principles:**
- Dark background (#1a1a1a or #0d0d0d) with neon accent colors (cyan, magenta, lime)
- Bold, geometric sans-serif (Courier New or Roboto Mono) for technical feel
- Visible structure: thick borders, glowing effects, layered depth
- High contrast; intentional "harsh" aesthetic that feels powerful and direct

**Color Philosophy:**
- Background: Deep charcoal (#1a1a1a)
- Text: Off-white (#f0f0f0)
- Primary Accent: Neon cyan (#00ffff)
- Secondary Accent: Neon magenta (#ff00ff)
- Borders: Cyan glow effect (box-shadow with blur)
- Rationale: Futuristic, energetic; neon accents create visual excitement; dark background reduces eye strain

**Layout Paradigm:**
- Asymmetric layout: form on left (70%), animated accent panel on right (30%) with gradient
- Thick glowing borders around form container
- Input fields with cyan underline and glow effect on focus
- Progress bar as a horizontal neon line that fills left-to-right

**Signature Elements:**
1. **Neon Glow Effects:** All interactive elements have subtle cyan glow (box-shadow: 0 0 10px rgba(0, 255, 255, 0.5))
2. **Geometric Accent Shapes:** Diagonal lines or triangles in corners; layered depth with overlapping elements
3. **Monospace Typography:** All text in Courier New or Roboto Mono for technical, intentional feel

**Interaction Philosophy:**
- Hover: Glow intensifies; accent color shifts to magenta
- Focus: Cyan glow expands; border color changes
- Click: Brief flash of magenta; slight inset effect
- Transitions: Snappy 150ms with linear easing

**Animation:**
- Neon glow pulse: Subtle breathing effect (opacity 0.7 → 1.0) at 2s interval
- Progress fill: Neon line animates left-to-right with glow trail
- Button press: Flash of magenta (50ms), then return to cyan
- Form entrance: Elements slide in from left with neon trail effect

**Typography System:**
- Display: Courier New Bold, 28px, all-caps for section titles
- Body: Roboto Mono, 14px, regular for labels
- Input: Roboto Mono, 14px, for form values
- Hierarchy: Weight, size, and selective neon color accents

</response>

---

## Selected Approach: **Raw Grid Brutalism**

I've chosen **Approach 1: Raw Grid Brutalism** as the design philosophy for this project.

### Why This Approach?

This design aligns perfectly with Speedy Apply's no-nonsense, efficient aesthetic while embracing neo-brutalist principles. The raw grid structure, heavy typography, and thick borders create a sense of intentionality and power. The design feels like it's built for speed and clarity—no distractions, just form and function.

### Design Commitment

Every component will follow these principles:
- **Typography:** IBM Plex Mono Bold for titles, IBM Plex Sans for body text
- **Spacing:** Strict grid alignment; no soft, rounded aesthetics
- **Colors:** Off-white background (#f5f5f5), deep charcoal text (#1a1a1a), electric blue accent (#0066ff)
- **Borders:** 3px solid black/dark gray; sharp corners; visible structure
- **Interactions:** Instant color inversions, snappy 100ms transitions, no easing
- **Layout:** Asymmetric two-column design with visible progress tracking

This approach ensures the onboarding flow feels authoritative, efficient, and intentional—exactly what a power user would expect from a Chrome extension.

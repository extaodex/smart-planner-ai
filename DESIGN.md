# Design System: The Synthetic Luminary

## 1. Overview & Creative North Star
The "Synthetic Luminary" is a design system crafted for the high-achieving student who demands both focus and a sense of "the future." 

**Creative North Star:** "The Digital Architect."
This system treats the interface as a multi-dimensional, holographic workspace. It uses intentional asymmetry and overlapping glass panels to create a signature, editorial feel.

---

## 2. Colors & Surface Philosophy
The palette is rooted in the void, allowing neon accents to feel like light emitted from a screen.

- **Background:** `#0e0e0e` (The Void)
- **Surface:** `#0e0e0e`
- **Surface Container:** `#1a1919`
- **Surface Container High:** `#201f1f`
- **Surface Container Highest:** `#262626`
- **Primary Accent:** `#6366f1` (Neon Indigo) - Used for primary actions and glowing effects.
- **Secondary Accent:** `#a855f7` (Electric Purple) - Used for AI-generated insights and highlights.
- **Tertiary Accent:** `#818cf8` (Neon Cyan) - Used for secondary data visualizations.

---

## 3. Typography
- **Display & Headlines:** `Space Grotesk` - Geometric and futuristic. Use for big, editorial moments.
- **Body & UI:** `Manrope` - High-end editorial readability. Swiss-inspired and neutral.

---

## 4. Visual Language
- **Glassmorphism:** All floating panels use `surface_variant` (#262626) at 60% opacity with 12px-20px backdrop blur.
- **Elevation:** Depth is achieved through tonal layering rather than traditional shadows.
- **No-Line Rule:** strictly avoid 1px borders for sectioning. Use background color shifts instead.
- **Ambient Glows:** Use extra-diffused shadows and neon glows for active elements.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_dim`), `xl` roundedness. Black text.
- **Secondary:** Transparent fill with a 'Ghost Border' of `outline`.

### AI Smart Chips
- Pill-shaped (`full` roundedness).
- `secondary` text on `secondary_container` background.

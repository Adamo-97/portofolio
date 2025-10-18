# Styling Guidelines

This document explains the styling patterns and design system used in the portfolio.

## Design System

### Color Palette

**Primary Brand Colors:**
```css
--cornflowerblue-100: #18a1fd;  /* Primary brand */
--cornflowerblue-400: #0A6FC2;  /* Darker variant */
```

**Neutrals:**
```css
--black: #000000;
--white: #ffffff;
--gray-300: rgba(255, 255, 255, 0.1);
--lightgray: rgba(255, 255, 255, 0.2);
```

**Semantic Colors:**
```css
--success: #10b981;  /* Green */
--error: #ef4444;    /* Red */
--warning: #f59e0b;  /* Amber */
```

### Typography

**Font Family:**
- **Primary:** "Urbanist" (Google Fonts)
- **Fallback:** system-ui, sans-serif

**Font Sizes (Responsive with clamp()):**
```css
--text-xs: clamp(10px, 1.5vw, 12px);
--text-sm: clamp(12px, 1.8vw, 14px);
--text-base: clamp(14px, 2.2vw, 18px);
--text-lg: clamp(16px, 2.5vw, 22px);
--text-xl: clamp(20px, 3vw, 28px);
--text-2xl: clamp(24px, 3.5vw, 36px);
--text-3xl: clamp(32px, 4.5vw, 48px);
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing Scale

Uses Tailwind's default spacing scale (4px base unit):
```
0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64
```

Responsive spacing with `clamp()`:
```css
padding: clamp(12px, 2.2vw, 24px);
gap: clamp(8px, 1.5vw, 16px);
```

### Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

Responsive radius:
```css
border-radius: clamp(12px, 2vw, 20px);
```

## Component Patterns

### Glass-Morphism Cards

Used for: Project cards, Skill cards, Contact form inputs

```css
.glass-card {
  background: rgba(15, 23, 41, 0.7);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(24, 161, 253, 0.3);
  box-shadow:
    0 4px 20px rgba(24, 161, 253, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glass-card:hover {
  border-color: rgba(24, 161, 253, 0.5);
  box-shadow:
    0 8px 30px rgba(24, 161, 253, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

### Glossy Effects

Top edge gradient for depth:

```tsx
<div className="relative">
  {/* Glossy top edge */}
  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
  
  {/* Content */}
</div>
```

### Glow Effects

```css
.glow {
  box-shadow: 0 0 20px rgba(24, 161, 253, 0.3);
}

.glow-strong {
  box-shadow: 
    0 0 30px rgba(24, 161, 253, 0.4),
    0 0 60px rgba(24, 161, 253, 0.2);
}
```

### Gradient Backgrounds

```css
/* Radial gradients for fog effects */
.fog-gradient {
  background: radial-gradient(
    circle at 20% 30%,
    rgba(24, 161, 253, 0.2) 0%,
    transparent 50%
  );
  filter: blur(80px);
}

/* Linear gradients for buttons */
.button-gradient {
  background: linear-gradient(
    135deg,
    rgba(24, 161, 253, 1) 0%,
    rgba(10, 111, 194, 1) 100%
  );
}
```

## Animation Patterns

### Entrance Animations

**Fade + Slide Up:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

**Staggered Children:**
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    {item.content}
  </motion.div>
))}
```

### Hover Animations

**Scale + Glow:**
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
  className="hover:shadow-[0_8px_30px_rgba(24,161,253,0.3)]"
>
```

**Rotate (for icons):**
```tsx
<motion.div
  whileHover={{ rotate: 15 }}
  transition={{ type: "spring", stiffness: 300 }}
>
```

### Layout Animations

**Tab Switching:**
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={selectedTab}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {content}
  </motion.div>
</AnimatePresence>
```

**Layout ID (smooth transitions):**
```tsx
{isOpen && (
  <motion.div
    layoutId="expandable-section"
    transition={{ type: "spring", damping: 20 }}
  >
    {content}
  </motion.div>
)}
```

## Tailwind Utilities

### Custom Utilities

**Transform GPU:**
```css
.transform-gpu {
  transform: translateZ(0);
  will-change: transform;
}
```

**Backdrop Blur:**
```css
.backdrop-blur-sm { backdrop-filter: blur(4px); }
.backdrop-blur { backdrop-filter: blur(8px); }
.backdrop-blur-md { backdrop-filter: blur(12px); }
.backdrop-blur-lg { backdrop-filter: blur(16px); }
```

**Text Gradients:**
```css
.text-gradient {
  background: linear-gradient(135deg, #18a1fd 0%, #0A6FC2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Common Combinations

**Centered Content:**
```tsx
<div className="flex items-center justify-center">
```

**Full Size:**
```tsx
<div className="w-full h-full">
```

**Absolute Center:**
```tsx
<div className="absolute inset-0 flex items-center justify-center">
```

**Responsive Padding:**
```tsx
<div className="px-4 sm:px-6 lg:px-8">
```

## Responsive Design

### Breakpoint Usage

```tsx
// Mobile first approach
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="p-4 md:p-6 lg:p-8"
```

### Mobile Optimizations

**Touch Targets:**
```tsx
// Minimum 44px for touch
className="min-h-[44px] min-w-[44px]"
```

**Hide on Mobile:**
```tsx
className="hidden md:block"
```

**Show on Mobile Only:**
```tsx
className="md:hidden"
```

### Fluid Typography

```tsx
className="text-[clamp(14px,2.2vw,18px)]"
```

## Performance Best Practices

### Animation Performance

**Use CSS transforms (not top/left):**
```css
/* ✅ Good - GPU accelerated */
transform: translateY(10px);

/* ❌ Bad - causes layout recalc */
top: 10px;
```

**Will-change for animated elements:**
```css
.animated-element {
  will-change: transform, opacity;
}
```

**Remove will-change after animation:**
```tsx
onAnimationComplete={() => {
  element.style.willChange = 'auto';
}}
```

### Rendering Optimizations

**Avoid inline styles (use Tailwind):**
```tsx
// ✅ Good
<div className="bg-blue-500 text-white">

// ❌ Avoid (unless dynamic)
<div style={{ backgroundColor: 'blue', color: 'white' }}>
```

**Use CSS Grid/Flexbox (not floats):**
```tsx
<div className="grid grid-cols-3 gap-4">
<div className="flex gap-4">
```

## Accessibility

### Focus States

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cornflowerblue-100"
```

### Color Contrast

Ensure WCAG AA compliance:
- Normal text: 4.5:1
- Large text: 3:1
- Interactive elements: 3:1

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Framer Motion:
```tsx
const shouldReduceMotion = useReducedMotion();

<motion.div
  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
>
```

## Dark Mode (Current Setup)

Portfolio uses dark theme only:

**Background:** `#000000` (black)
**Text:** `#ffffff` (white)
**Accents:** `#18a1fd` (cornflowerblue)

**Note:** To add light mode in future, use:
```tsx
className="bg-black dark:bg-white text-white dark:text-black"
```

## Icon System

**Location:** `/public/[page]/`

**Format:** SVG (scalable, small file size)

**Usage:**
```tsx
import Image from "next/image";

<Image
  src="/home/icon.svg"
  width={24}
  height={24}
  alt="Icon description"
/>
```

**Fallback for Supabase icons:**
```tsx
const iconSrc = icon_path?.startsWith('http')
  ? icon_path
  : supabase.storage.from('cv-icons').getPublicUrl(icon_path).data.publicUrl;
```

## Browser-Specific Styles

**Chrome/Safari scrollbar:**
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(24, 161, 253, 0.3);
  border-radius: 4px;
}
```

**Firefox scrollbar:**
```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(24, 161, 253, 0.3) rgba(255, 255, 255, 0.05);
}
```

## Related Documentation

- [Architecture](./ARCHITECTURE.md)
- [Features](./FEATURES.md)
- [Database](./DATABASE.md)

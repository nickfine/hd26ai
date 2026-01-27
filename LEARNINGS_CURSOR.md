# HD26AI Development Learnings

This document captures the development workflow, key learnings, issues encountered, and solutions discovered. Read this before starting any work.

---

## ⚠️ PARITY REQUIREMENT - READ FIRST ⚠️

**Effective January 25, 2026**: HD26Forge and HD26AI have achieved feature parity. **All future feature development MUST be implemented in BOTH apps simultaneously.**

See HD26Forge's `LEARNINGS_CURSOR.md` for the full parity checklist and component mapping guide.

---

## Light/Dark Mode Theme System (January 27, 2026)

### Architecture

HD26AI uses a comprehensive theme system:

1. **CSS Variables** (`src/styles/tokens.css`)
   - Light mode tokens in `:root`
   - Dark mode tokens in `[data-color-mode="dark"]`

2. **Theme Hook** (`src/hooks/useTheme.js`)
   - Three modes: light, dark, system
   - Persists to localStorage (`hd26-theme`)
   - Listens to `prefers-color-scheme` media query
   - Sets `data-color-mode` attribute on document root

3. **Tailwind Integration** (`tailwind.config.js`)
   - Colors reference CSS variables: `var(--text-primary)`
   - Enables automatic theme switching without class changes

### Common Theme Issues

#### Issue: White Text on White Background
**Symptoms**: Text invisible in light mode, visible in dark mode.

**Root Causes**:
1. Hardcoded `text-white` Tailwind classes
2. Hardcoded hex colors in Tailwind config

**Solution**: Use theme-aware classes:
```javascript
// ❌ BAD: Hardcoded white
<h1 className="text-white">Title</h1>

// ✅ GOOD: Theme-aware
<h1 className="text-text-primary">Title</h1>
```

#### Issue: Button Text Invisible
**Problem**: Primary button showed as empty box in light mode.

**Root Cause**: `BUTTON_VARIANTS` in `design-system.js` used `text-white` with `bg-arena-elevated` which both resolved to white/light colors in light mode.

**Solution**: Update button variants to use brand color for primary buttons:
```javascript
// Before (broken in light mode)
primary: {
  base: 'bg-arena-elevated text-white border border-arena-border',
  // ...
},

// After (works in both modes)
primary: {
  base: 'bg-brand text-white border border-brand',
  hover: 'hover:bg-brand/90 hover:-translate-y-0.5',
  // ...
},
```

### Brand Color Setup

Added brand color to Tailwind using CSS variable:

```javascript
// tailwind.config.js
colors: {
  brand: {
    DEFAULT: 'var(--accent-brand)',
    subtle: 'var(--accent-brand-subtle)',
  },
  // ...
}
```

Tokens defined in `tokens.css`:
```css
/* Light mode */
:root {
  --accent-brand: #FF5630;        /* HackDay orange-red */
  --accent-brand-subtle: #FFEBE6; /* Brand backgrounds */
}

/* Dark mode */
[data-color-mode="dark"] {
  --accent-brand: #FF7452;        /* Lighter for dark mode */
  --accent-brand-subtle: #43290F; /* Darkened background */
}
```

### Theme-Aware Color Classes

| Use Case | Tailwind Class | CSS Variable |
|----------|---------------|--------------|
| Primary text | `text-text-primary` | `--text-primary` |
| Secondary text | `text-text-secondary` | `--text-secondary` |
| Muted/disabled text | `text-text-muted` | `--text-disabled` |
| Card background | `bg-arena-card` | `--surface-primary` |
| Page background | `bg-arena-bg` | `--surface-secondary` |
| Primary button | `bg-brand text-white` | `--accent-brand` |

### Testing Theme Changes

1. Use dev server on localhost (faster iteration)
2. Toggle theme via the header dropdown
3. Check all pages in both light and dark modes
4. Verify text contrast meets WCAG AA (4.5:1 for normal text)

---

## Sticky Header Implementation (January 27, 2026)

### Problem
Header and event progress bar needed to stick together, with content flowing underneath.

### Solution
Wrap both elements in a single sticky container:

```jsx
<div className="sticky top-0 z-40 bg-arena-black">
  <header>...</header>
  <div className="border-b">Event Progress Bar...</div>
</div>
```

### Sidebar Z-Index
The sidebar needs conditional z-index:
- Mobile (menu open): `z-50` (above sticky header for overlay)
- Desktop: `z-30` (below sticky header)

```jsx
<aside className={cn(
  sidebarOpen ? 'z-50' : 'lg:z-30',
  // ...
)}>
```

---

## Development Workflow

### Running Locally
```bash
cd /Volumes/Extreme\ Pro/HD26AI
npm run dev
```

### Git Branches
- `main` - Production (auto-deploys to Vercel)
- `UIpolish` - UI enhancement work (merge to main when ready)

### After Making Changes
1. Test locally in both light and dark modes
2. Commit with descriptive message
3. Push to trigger Vercel deployment
4. Verify on production (~2 min deployment)

---

*Last updated: January 27, 2026*

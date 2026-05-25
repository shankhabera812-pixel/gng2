# Grill & Green

Healthy food and craft coffee website — Worcester, MA.  
Built with pure HTML, CSS, and Vanilla JavaScript. No bundler. No framework.

## Project Structure

```
grill-and-green/
├── index.html            # Homepage
├── menu.html             # Full menu page
├── styles/
│   ├── tokens.css        # Design tokens (colors, fonts, spacing, shadows)
│   ├── base.css          # Reset, body, focus, utilities
│   ├── components.css    # Buttons, cards, chips, badges, toast
│   ├── nav.css           # Navigation + mobile overlay
│   ├── motion.css        # Keyframes, scroll-reveal, reduced-motion
│   ├── home.css          # Homepage sections + footer
│   └── menu.css          # Menu page — tabs, filters, sections
├── js/
│   ├── main.js           # Entry point
│   ├── nav.js            # Mobile overlay + focus trap
│   ├── rewards-toast.js  # Toast dismiss with sessionStorage
│   ├── breeze.js         # Hero word-by-word animation
│   ├── scroll-reveal.js  # IntersectionObserver scroll-reveal
│   ├── menu-render.js    # Renders menu from data/menu.json
│   ├── scroll-spy.js     # Active tab tracking on menu page
│   ├── dietary-filter.js # Dietary filter chips
│   └── drinks-bg.js      # Background shift + drinks sub-nav
├── data/
│   └── menu.json         # Single source of truth — 24 sections, 183 items
└── assets/
    └── images/
        ├── menu/         # All dish and drink photos
        ├── hero/         # Hero photography
        └── story/        # Our Story section images
```

## Running Locally

The menu is loaded via `fetch('data/menu.json')` — you need a local server:

```bash
# Python (recommended)
python -m http.server 8080

# Node.js
npx serve .

# VSCode
Install the "Live Server" extension, then right-click index.html → Open with Live Server
```

Then open `http://localhost:8080`.

## Design System

- **Colors:** Ember (`#C94D20`) · Midnight Botanical (`#1D2B17`) · Pale Field (`#EEF0E9`)
- **Fonts:** Instrument Serif (display) · Space Grotesk (UI) · Karla (body)
- **Shadows:** Warm green-tinted only — never cold blue-gray
- **Motion:** All animations respect `prefers-reduced-motion`
- **Accessibility:** WCAG AA contrast · 44px touch targets · keyboard navigation · focus traps

## Menu Data

All pricing and item details live in `data/menu.json`. Edit that file to update the menu — the page re-renders automatically on next load.

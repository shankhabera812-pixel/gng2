/* ============================================================
   GRILL & GREEN — MAIN ENTRY POINT
   Initializes all modules. Split by page context.
   ============================================================ */

import { initRewardsToast }  from './rewards-toast.js';
import { initNav }           from './nav.js';
import { initScrollReveal }  from './scroll-reveal.js';

// Homepage-only
import { initBreeze }        from './breeze.js';

// Menu-page-only
import { renderMenu }        from './menu-render.js';
import { initTabPanels }     from './tab-panels.js';
import { initDietaryFilter } from './dietary-filter.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ---- Shared across both pages ----
  initRewardsToast();
  initNav();
  initScrollReveal();

  // ---- Homepage only ----
  if (document.body.dataset.page === 'home') {
    initBreeze();
  }

  // ---- Menu page only ----
  if (document.body.dataset.page === 'menu') {
    // 1. Render all section elements into the DOM (all hidden by CSS)
    await renderMenu();

    // 2. Wire tab panel switching — this also activates the first tab
    const panels = initTabPanels();
    if (panels) panels.activateFirst();

    // 3. Wire dietary filter chips
    initDietaryFilter();

    // 4. Scroll-reveal for cards in the initial panel
    initScrollReveal();
  }
});

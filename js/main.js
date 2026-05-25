/* ============================================================
   GRILL & GREEN — MAIN ENTRY POINT
   Initializes all modules. Split by page context.
   ============================================================ */

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
  initNav();
  initScrollReveal();

  // ---- Homepage only ----
  if (document.body.dataset.page === 'home') {
    initBreeze();
  }

  // ---- Menu page only ----
  if (document.body.dataset.page === 'menu') {
    await renderMenu();

    const panels = initTabPanels();
    if (panels) panels.activateFirst();

    initDietaryFilter();
    initScrollReveal();
  }
});

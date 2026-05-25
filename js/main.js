/* ============================================================
   GRILL & GREEN — MAIN ENTRY POINT
   Initializes all modules. Split by page context.
   ============================================================ */

import { initRewardsToast } from './rewards-toast.js';
import { initNav }          from './nav.js';
import { initScrollReveal } from './scroll-reveal.js';

// Homepage-only
import { initBreeze }       from './breeze.js';

// Menu-page-only
import { renderMenu }       from './menu-render.js';
import { initScrollSpy }    from './scroll-spy.js';
import { initDietaryFilter } from './dietary-filter.js';
import { initDrinksBg }     from './drinks-bg.js';

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
    // Render the menu first, then wire interactivity
    await renderMenu();

    // After render, init scroll-based features
    initScrollSpy();
    initDietaryFilter();
    initDrinksBg();

    // Re-run scroll reveal for the newly rendered cards
    initScrollReveal();
  }
});

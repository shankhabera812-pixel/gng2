/* ============================================================
   TAB PANELS
   Replaces scroll-spy. Each tab click shows only that tab's
   sections and resets the page to the top of the menu content.

   Food tabs → one section each
   Drinks tab (data-group="drinks") → all drink-group sections
   Sides tab (data-target="snacks") → snacks + sides sections
   ============================================================ */

import { resetFilters } from './dietary-filter.js';
import { getToolbarHeight, flashToolbarExpand, syncToolbarCompact } from './menu-toolbar-compact.js';

const DRINKS_GROUP = 'drinks';

export function initTabPanels() {
  const tabs         = document.querySelectorAll('.menu-tab');
  const menuSections = document.getElementById('menu-sections');

  if (!tabs.length || !menuSections) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchPanel(tab));
    // Keyboard: Space / Enter already fire click on buttons, no extra handler needed
  });

  /**
   * Show only the sections belonging to the clicked tab.
   * All other sections get display:none via removal of .panel-active.
   */
  function switchPanel(clickedTab) {
    // Clear search if active
    const searchInput = document.getElementById('menu-search-input');
    if (searchInput && searchInput.value) {
      const clearBtn = document.getElementById('menu-search-clear');
      if (clearBtn) clearBtn.click();
    }

    const targetId   = clickedTab.dataset.target;
    const isdrinks   = clickedTab.dataset.group === DRINKS_GROUP;
    const drinkGroup = clickedTab.dataset.drinkGroup;

    // ---- Update tab state ----
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    clickedTab.classList.add('active');
    clickedTab.setAttribute('aria-selected', 'true');

    // ---- Hide every section ----
    menuSections.querySelectorAll('.menu-section').forEach(s => {
      s.classList.remove('panel-active');
    });

    // ---- Show the right section(s) ----
    if (drinkGroup) {
      menuSections.querySelectorAll(`.menu-section[data-drink-group="${drinkGroup}"]`)
        .forEach(s => s.classList.add('panel-active'));
    } else if (isdrinks) {
      menuSections.querySelectorAll(`.menu-section[data-group="${DRINKS_GROUP}"]`)
        .forEach(s => s.classList.add('panel-active'));
    } else {
      // Sides tab: "snacks" is the target; also reveal "sides" section alongside it
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      targetSection.classList.add('panel-active');

      // If this is the snacks section, also show sides
      if (targetId === 'snacks') {
        const sidesSection = document.getElementById('sides');
        if (sidesSection) sidesSection.classList.add('panel-active');
      }
    }

    // ---- Scroll to top of menu content ----
    const menuBody = document.getElementById('menu-body');
    if (menuBody) {
      const stickyHeight = getToolbarHeight();
      const navHeight    = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68',
        10
      );
      const y = menuBody.getBoundingClientRect().top + window.scrollY - navHeight - stickyHeight;
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
    }

    syncToolbarCompact();
    flashToolbarExpand();

    // ---- Reset dietary filters to "All" ----
    resetFilters();
  }

  /**
   * Expose switchPanel so menu-render.js can activate the first
   * panel once sections are in the DOM.
   */
  return { activateFirst: () => {
    const firstTab = tabs[0];
    if (firstTab) switchPanel(firstTab);
  }};
}

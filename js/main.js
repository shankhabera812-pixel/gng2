import { initNav }           from './nav.js';
import { initScrollReveal }  from './scroll-reveal.js';
import { initBreeze }        from './breeze.js';
import { renderMenu }        from './menu-render.js';
import { initTabPanels }     from './tab-panels.js';
import { initDietaryFilter } from './dietary-filter.js';
import { initMenuSearch }    from './menu-search.js';
import { initItemPreview }   from './item-preview.js';
import { initMenuToolbarCompact } from './menu-toolbar-compact.js';

document.addEventListener('DOMContentLoaded', async () => {
  // ---- Shared across both pages ----
  initNav();
  initScrollReveal();

  // ---- Homepage only ----
  if (document.body.dataset.page === 'home') {
    initBreeze();

    let customizations = {};
    try {
      const res = await fetch('data/customizations.json');
      customizations = await res.json();
    } catch (err) {
      console.warn('Could not load customizations.json', err);
    }

    let sections = [];
    try {
      const res = await fetch('data/menu.json');
      const data = await res.json();
      sections = data.sections;
    } catch (err) {
      console.warn('Could not load menu.json', err);
    }

    if (sections.length > 0) {
      initItemPreview({ sections, customizations });
    }
  }

  // ---- Menu page only ----
  if (document.body.dataset.page === 'menu') {
    let customizations = {};
    try {
      const res = await fetch('data/customizations.json');
      customizations = await res.json();
    } catch (err) {
      console.warn('Could not load customizations.json', err);
    }

    const sections = await renderMenu({ customizations });

    const panels = initTabPanels();
    initDietaryFilter();
    initMenuToolbarCompact();
    if (panels) panels.activateFirst();

    initMenuSearch({ sections, customizations });
    initItemPreview({ sections, customizations });
    initScrollReveal();
  }
});

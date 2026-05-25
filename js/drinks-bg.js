/* ============================================================
   DRINKS BG CONTEXT
   Subtle bg shift (#E8EAE1) when user scrolls into drinks sections.
   Shows/hides the drinks sub-navigation.
   ============================================================ */

export function initDrinksBg() {
  const menuBody    = document.querySelector('.menu-body');
  const drinksSubnav = document.querySelector('.drinks-subnav-wrapper');
  const drinkSubTabs = document.querySelectorAll('.drinks-sub-tab');

  // The first drinks section marks the transition point
  function getDrinksSections() {
    return document.querySelectorAll('.menu-section[data-drinks-sub]');
  }

  // ---- Drinks sub-tab clicks ----
  drinkSubTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      const section  = document.getElementById(targetId);
      if (!section) return;

      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--tab-offset') || '124',
        10
      ) + 36; // extra for sub-nav height

      const y = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ---- Show/hide drinks context ----
  let drinksSections = [];

  function setup() {
    drinksSections = Array.from(getDrinksSections());
    if (drinksSections.length === 0) return;

    // Use IntersectionObserver to track if ANY drinks section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = drinksSections.some(s => {
          const rect = s.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });

        // Check if we're actually IN the drinks region
        const viewportCenter = window.scrollY + window.innerHeight * 0.4;
        const firstDrinks = drinksSections[0];
        const firstRect   = firstDrinks.getBoundingClientRect();
        const firstTop    = firstRect.top + window.scrollY;

        const inDrinksRegion = window.scrollY + window.innerHeight * 0.4 >= firstTop;

        if (menuBody) menuBody.classList.toggle('drinks-context', inDrinksRegion);
        if (drinksSubnav) {
          drinksSubnav.classList.toggle('visible', inDrinksRegion);
          drinksSubnav.setAttribute('aria-hidden', String(!inDrinksRegion));
        }

        // Update active sub-tab
        updateActiveSubTab();
      },
      { rootMargin: '0px 0px -50% 0px' }
    );

    drinksSections.forEach(s => observer.observe(s));
  }

  function updateActiveSubTab() {
    const viewportTop = window.scrollY + 160;

    let currentSub = null;
    drinksSections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= viewportTop) {
        currentSub = section.dataset.drinksSub;
      }
    });

    drinkSubTabs.forEach(tab => {
      tab.classList.toggle(
        'active',
        tab.textContent.trim().toLowerCase() === (currentSub || '').toLowerCase()
      );
    });
  }

  // Wait for menu to render before setting up
  const menuSections = document.getElementById('menu-sections');
  if (menuSections && menuSections.children.length === 0) {
    new MutationObserver((_, obs) => {
      setup();
      obs.disconnect();
    }).observe(menuSections, { childList: true });
  } else {
    setup();
  }
}

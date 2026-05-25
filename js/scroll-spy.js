/* ============================================================
   SCROLL-SPY
   Auto-updates active tab as user scrolls through menu sections.
   rootMargin: '0px 0px -60% 0px' — tab activates when section
   enters upper 40% of viewport.
   Tab click → smooth scroll with 124px offset (68px nav + 56px tabs).
   ============================================================ */

export function initScrollSpy() {
  const tabsWrapper = document.querySelector('.menu-tabs-wrapper');
  const tabBar      = document.querySelector('.menu-tabs');
  if (!tabBar) return;

  const tabs = tabBar.querySelectorAll('.menu-tab');

  // ---- Scroll offset ----
  const OFFSET = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--tab-offset') || '124',
    10
  );

  // ---- Tab click → scroll to section ----
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;
      const section  = document.getElementById(targetId);
      if (!section) return;

      const y = section.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ---- IntersectionObserver scroll-spy ----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.id;
        setActiveTab(sectionId);
      });
    },
    { rootMargin: '0px 0px -60% 0px', threshold: 0 }
  );

  // Observe all sections that have a matching tab
  const observedIds = new Set();
  tabs.forEach(tab => {
    const id = tab.dataset.target;
    if (id) observedIds.add(id);
  });

  // Also observe any section (scroll reveals will add them later via MutationObserver)
  function observeSections() {
    document.querySelectorAll('.menu-section[id]').forEach(section => {
      if (observedIds.has(section.id)) {
        observer.observe(section);
      }
    });
  }

  observeSections();

  // Re-observe if menu renders async
  const mutObs = new MutationObserver(() => {
    observeSections();
    mutObs.disconnect();
  });
  const menuSections = document.getElementById('menu-sections');
  if (menuSections) {
    mutObs.observe(menuSections, { childList: true });
  }

  // ---- Active tab highlight ----
  function setActiveTab(sectionId) {
    // Find tab by section id or by first section of that tab
    let matched = false;

    tabs.forEach(tab => {
      const isActive = tab.dataset.target === sectionId ||
                       tab.dataset.sections?.split(',').includes(sectionId);

      tab.classList.toggle('active', isActive);
      if (isActive) {
        matched = true;
        // Scroll tab into view within the tab bar
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      }
    });

    // If no exact tab match, try to find parent tab for this section
    if (!matched) {
      const section = document.getElementById(sectionId);
      if (section) {
        const group = section.dataset.drinksSub ? 'drinks' : null;
        if (group) {
          const drinksTab = tabBar.querySelector('[data-target="fruit-smoothies"]') ||
                            tabBar.querySelector('[data-group="drinks"]');
          if (drinksTab) {
            tabs.forEach(t => t.classList.remove('active'));
            drinksTab.classList.add('active');
          }
        }
      }
    }
  }
}

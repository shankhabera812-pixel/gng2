/* ============================================================
   DIETARY FILTER
   CSS class toggle approach — no DOM add/remove.
   Non-matching cards fade to opacity 0.14 + scale(0.98).
   Multi-select: active filters must ALL be present on a card.
   ============================================================ */

export function initDietaryFilter() {
  const filterRow = document.querySelector('.menu-filters');
  if (!filterRow) return;

  const chips = filterRow.querySelectorAll('.filter-chip[data-filter]');
  const activeFilters = new Set();

  chips.forEach(chip => {
    chip.setAttribute('role', 'switch');
    chip.setAttribute('aria-checked', 'false');
    chip.setAttribute('tabindex', '0');

    chip.addEventListener('click', () => toggleFilter(chip));
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFilter(chip);
      }
    });
  });

  function toggleFilter(chip) {
    const filter = chip.dataset.filter;

    if (filter === 'ALL') {
      // Clear all filters
      activeFilters.clear();
      chips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
    } else {
      // Deactivate "All" chip
      const allChip = filterRow.querySelector('[data-filter="ALL"]');
      if (allChip) {
        allChip.classList.remove('active');
        allChip.setAttribute('aria-checked', 'false');
      }

      if (activeFilters.has(filter)) {
        activeFilters.delete(filter);
        chip.classList.remove('active');
        chip.setAttribute('aria-checked', 'false');
      } else {
        activeFilters.add(filter);
        chip.classList.add('active');
        chip.setAttribute('aria-checked', 'true');
      }

      // If nothing selected, reactivate "All"
      if (activeFilters.size === 0 && allChip) {
        allChip.classList.add('active');
        allChip.setAttribute('aria-checked', 'true');
      }
    }

    applyFilters();
  }

  function applyFilters() {
    // Observe all rendered menu cards
    const cards = document.querySelectorAll('.menu-card');

    cards.forEach(card => {
      if (activeFilters.size === 0) {
        card.classList.remove('filtered-out');
        return;
      }

      const cardTags = card.dataset.tags
        ? new Set(card.dataset.tags.split(','))
        : new Set();

      // All active filters must be present on the card
      const matches = [...activeFilters].every(f => cardTags.has(f));

      if (matches) {
        card.classList.remove('filtered-out');
      } else {
        card.classList.add('filtered-out');
      }
    });
  }

  // Re-apply when menu renders (async)
  const menuSections = document.getElementById('menu-sections');
  if (menuSections) {
    new MutationObserver(() => {
      if (activeFilters.size > 0) applyFilters();
    }).observe(menuSections, { childList: true, subtree: true });
  }
}

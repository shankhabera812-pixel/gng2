/* ============================================================
   DIETARY FILTER
   CSS class toggle — no DOM add/remove.
   Non-matching cards fade to opacity 0.14 + scale(0.98).
   Multi-select: ALL active filters must be present on a card.

   resetFilters() is exported so tab-panels.js can call it
   when switching sections (clears state back to "All").
   ============================================================ */

const activeFilters = new Set();
let allChip = null;
let chips   = null;

export function initDietaryFilter() {
  const filterRow = document.querySelector('.menu-filters');
  if (!filterRow) return;

  chips   = Array.from(filterRow.querySelectorAll('.filter-chip[data-filter]'));
  allChip = filterRow.querySelector('[data-filter="ALL"]');

  chips.forEach(chip => {
    chip.addEventListener('click',   () => toggleFilter(chip));
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFilter(chip); }
    });
  });
}

function toggleFilter(chip) {
  const filter = chip.dataset.filter;

  if (filter === 'ALL') {
    activeFilters.clear();
    chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-checked', 'false'); });
    chip.classList.add('active');
    chip.setAttribute('aria-checked', 'true');
  } else {
    // Deactivate the "All" chip
    if (allChip) { allChip.classList.remove('active'); allChip.setAttribute('aria-checked', 'false'); }

    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
      chip.classList.remove('active');
      chip.setAttribute('aria-checked', 'false');
    } else {
      activeFilters.add(filter);
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
    }

    // Nothing selected → reactivate "All"
    if (activeFilters.size === 0 && allChip) {
      allChip.classList.add('active');
      allChip.setAttribute('aria-checked', 'true');
    }
  }

  applyFilters();
}

function applyFilters() {
  // Only operate on cards inside currently-visible panels
  document.querySelectorAll('.menu-section.panel-active .menu-card').forEach(card => {
    if (activeFilters.size === 0) {
      card.classList.remove('filtered-out');
      return;
    }
    const cardTags = card.dataset.tags
      ? new Set(card.dataset.tags.split(','))
      : new Set();

    const matches = [...activeFilters].every(f => cardTags.has(f));
    card.classList.toggle('filtered-out', !matches);
  });

  // Ensure cards in hidden panels are never stuck with the class
  document.querySelectorAll('.menu-section:not(.panel-active) .menu-card').forEach(card => {
    card.classList.remove('filtered-out');
  });
}

/**
 * Exported so tab-panels.js can reset filters on section switch.
 */
export function resetFilters() {
  if (!chips) return;
  activeFilters.clear();
  chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-checked', 'false'); });
  if (allChip) { allChip.classList.add('active'); allChip.setAttribute('aria-checked', 'true'); }
  // Remove filtered-out from all cards
  document.querySelectorAll('.menu-card.filtered-out').forEach(c => c.classList.remove('filtered-out'));
}

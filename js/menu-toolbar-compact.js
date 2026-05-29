/* ============================================================
   MENU TOOLBAR COMPACT
   Collapses sticky search/tabs/filters when user scrolls into
   menu items. Exposes height helpers for tab-panels scroll offset.
   ============================================================ */

import { getActiveFilterCount } from './dietary-filter.js';

let wrapper = null;
let isCompact = false;
let forceExpanded = false;
let flashTimer = null;
let scrollTicking = false;

const HYSTERESIS = 40;

function getNavHeight() {
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68',
    10
  );
}

export function getToolbarHeight() {
  return wrapper?.offsetHeight ?? 0;
}

export function scrollActiveTabIntoView() {
  const activeTab = wrapper?.querySelector('.menu-tab.active');
  if (activeTab) {
    activeTab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }
}

export function setToolbarForceExpanded(expanded) {
  forceExpanded = expanded;
  applyCompactState();
}

export function flashToolbarExpand() {
  forceExpanded = true;
  applyCompactState();
  scrollActiveTabIntoView();
  clearTimeout(flashTimer);
  flashTimer = setTimeout(() => {
    forceExpanded = false;
    applyCompactState();
  }, 300);
}

function updateToolbarHeightVar() {
  if (!wrapper) return;
  document.documentElement.style.setProperty('--menu-toolbar-h', `${wrapper.offsetHeight}px`);
}

function updateFilterBadge() {
  const badge = wrapper?.querySelector('.menu-filters-toggle__badge');
  if (!badge) return;
  const count = getActiveFilterCount();
  if (count > 0) {
    badge.hidden = false;
    badge.textContent = String(count);
  } else {
    badge.hidden = true;
    badge.textContent = '';
  }
}

function applyCompactState() {
  if (!wrapper) return;

  const shouldCompact = isCompact && !forceExpanded
    && !wrapper.classList.contains('search-expanded')
    && !wrapper.classList.contains('filters-open');

  wrapper.classList.toggle('menu-tabs-wrapper--compact', shouldCompact);
  updateToolbarHeightVar();

  if (shouldCompact) {
    scrollActiveTabIntoView();
  }
}

function evaluateScroll() {
  if (!wrapper) return;

  const navHeight = getNavHeight();
  const scrollY = window.scrollY;
  const compactOn = wrapper.offsetTop - navHeight - 20;
  const compactOff = compactOn - HYSTERESIS;

  if (!isCompact && scrollY >= compactOn) {
    isCompact = true;
  } else if (isCompact && scrollY <= compactOff) {
    isCompact = false;
    wrapper.classList.remove('search-expanded', 'filters-open');
    const searchToggle = wrapper.querySelector('.menu-search-toggle');
    const filtersToggle = wrapper.querySelector('.menu-filters-toggle');
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
    if (filtersToggle) filtersToggle.setAttribute('aria-expanded', 'false');
  }

  applyCompactState();
}

function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    evaluateScroll();
    scrollTicking = false;
  });
}

function setSearchExpanded(expanded) {
  if (!wrapper) return;
  wrapper.classList.toggle('search-expanded', expanded);
  const toggle = wrapper.querySelector('.menu-search-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', String(expanded));
  if (expanded) {
    forceExpanded = true;
    applyCompactState();
    const input = document.getElementById('menu-search-input');
    if (input) input.focus();
  } else if (!document.getElementById('menu-search-input')?.value) {
    forceExpanded = false;
    applyCompactState();
  }
}

function setFiltersOpen(open) {
  if (!wrapper) return;
  wrapper.classList.toggle('filters-open', open);
  const toggle = wrapper.querySelector('.menu-filters-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', String(open));
  forceExpanded = open;
  applyCompactState();
}

export function syncToolbarCompact() {
  evaluateScroll();
}

export function initMenuToolbarCompact() {
  wrapper = document.querySelector('.menu-tabs-wrapper');
  const menuBody = document.getElementById('menu-body');
  if (!wrapper || !menuBody) return;

  const searchToggle = wrapper.querySelector('.menu-search-toggle');
  const filtersToggle = wrapper.querySelector('.menu-filters-toggle');
  const searchInput = document.getElementById('menu-search-input');

  searchToggle?.addEventListener('click', () => {
    setSearchExpanded(!wrapper.classList.contains('search-expanded'));
  });

  filtersToggle?.addEventListener('click', () => {
    setFiltersOpen(!wrapper.classList.contains('filters-open'));
  });

  searchInput?.addEventListener('focus', () => {
    wrapper.classList.add('search-expanded');
    searchToggle?.setAttribute('aria-expanded', 'true');
    forceExpanded = true;
    applyCompactState();
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.classList.contains('filters-open')) return;
    if (e.target.closest('.menu-filters-panel') || e.target.closest('.menu-filters-toggle')) return;
    setFiltersOpen(false);
  });

  document.addEventListener('menu-filters-changed', updateFilterBadge);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateToolbarHeightVar();
    evaluateScroll();
  });

  updateFilterBadge();
  updateToolbarHeightVar();
  evaluateScroll();
}

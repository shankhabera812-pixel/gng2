import { applyFilters } from './dietary-filter.js';
import { buildCard } from './menu-render.js';

export function initMenuSearch({ sections, customizations }) {
  const searchInput = document.getElementById('menu-search-input');
  const clearBtn = document.getElementById('menu-search-clear');
  const countSpan = document.getElementById('menu-search-count');
  const menuSections = document.getElementById('menu-sections');
  const tabsWrapper = document.querySelector('.menu-tabs-wrapper');

  if (!searchInput || !menuSections) return;

  // Build a flat index
  const index = [];
  sections.forEach(section => {
    section.items.forEach(item => {
      index.push({
        item,
        section,
        name: item.name.toLowerCase(),
        desc: (item.desc || '').toLowerCase(),
        tags: (item.tags || []).map(t => t.toLowerCase()),
        sectionName: section.name.toLowerCase(),
        synonyms: getSynonyms(item.name, item.desc, section.name).toLowerCase()
      });
    });
  });

  // Create search results container
  const resultsContainer = document.createElement('section');
  resultsContainer.id = 'search-results-section';
  resultsContainer.className = 'menu-section panel-active';
  resultsContainer.style.display = 'none';

  const grid = document.createElement('div');
  grid.className = 'container menu-section__grid';
  resultsContainer.appendChild(grid);

  // Empty state container
  const emptyState = document.createElement('div');
  emptyState.className = 'menu-search-empty';
  emptyState.style.display = 'none';
  resultsContainer.appendChild(emptyState);

  menuSections.appendChild(resultsContainer);

  let searchTimeout = null;

  // Handle Search Input
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(searchInput.value.trim());
    }, 150);
  });

  // Handle Clear Button
  clearBtn.addEventListener('click', clearSearch);
  
  // Keyboard accessibility & mobile keyboard dismissal
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearSearch();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      searchInput.blur();
    }
  });

  function scoreItem(entry, query) {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);
    
    // Exact match in name
    if (entry.name === lowerQuery) {
      score += 100;
    } else if (entry.name.startsWith(lowerQuery)) {
      score += 80;
    } else if (entry.name.includes(lowerQuery)) {
      score += 60;
    }
    
    // Word-by-word matching
    const nameWords = entry.name.split(/\s+/);
    queryWords.forEach(word => {
      if (nameWords.includes(word)) score += 20;
      if (entry.desc.includes(word)) score += 10;
      if (entry.synonyms.includes(word)) score += 15;
      if (entry.tags.includes(word)) score += 25;
      if (entry.sectionName.includes(word)) score += 15;
    });

    // Fuzzy/Partial match
    if (entry.desc.includes(lowerQuery)) score += 40;
    if (entry.synonyms.includes(lowerQuery)) score += 30;

    return score;
  }

  function performSearch(query) {
    if (!query) {
      clearSearch();
      return;
    }
    
    // Dim tabs
    if (tabsWrapper) tabsWrapper.classList.add('search-active');

    // Hide all normal sections by removing panel-active
    document.querySelectorAll('.menu-section:not(#search-results-section)').forEach(s => {
      s.classList.remove('panel-active');
    });

    // Show results section
    resultsContainer.style.display = 'block';
    resultsContainer.classList.add('panel-active');
    
    // Score and sort index
    const scoredResults = index.map(entry => ({
      ...entry,
      score: scoreItem(entry, query)
    })).filter(r => r.score > 0);

    scoredResults.sort((a, b) => b.score - a.score);

    // Render results
    grid.innerHTML = '';
    
    if (scoredResults.length > 0) {
      emptyState.style.display = 'none';
      grid.style.display = '';
      
      scoredResults.forEach(({ item, section }) => {
        const card = buildCard(item, section, { customizations, searchResult: true });
        // Force the card to be visible immediately, bypassing scroll reveal
        card.classList.remove('reveal-stagger');
        card.classList.add('revealed');
        grid.appendChild(card);
      });
      applyFilters();

    } else {
      emptyState.style.display = 'block';
      emptyState.textContent = `Nothing found for "${query}" — try an ingredient, category, or dietary tag.`;
      grid.style.display = 'none';
    }

    countSpan.textContent = `${scoredResults.length} items match "${query}"`;
    clearBtn.style.display = 'block';
  }

  function clearSearch() {
    searchInput.value = '';
    countSpan.textContent = '';
    clearBtn.style.display = 'none';
    
    if (tabsWrapper) tabsWrapper.classList.remove('search-active');
    
    resultsContainer.style.display = 'none';
    resultsContainer.classList.remove('panel-active');

    // Restore last active tab
    const activeTab = document.querySelector('.menu-tab.active');
    if (activeTab) {
      activeTab.click();
    }
  }

  function getSynonyms(name, desc, sectionName) {
    let syns = [];
    const text = `${name} ${desc} ${sectionName}`.toLowerCase();
    
    if (text.includes('coffee') || text.includes('espresso') || text.includes('latte') || text.includes('cappuccino')) syns.push('coffee espresso latte cappuccino');
    if (text.includes('tea') || text.includes('chai') || text.includes('matcha') || text.includes('thai tea')) syns.push('tea chai matcha thai tea');
    if (text.includes('smoothie') || text.includes('blend') || text.includes('shake')) syns.push('smoothie blend shake');
    if (text.includes('juice') || text.includes('cold-pressed') || text.includes('pressed')) syns.push('juice cold-pressed pressed');
    if (text.includes('vegan') || text.includes('plant-based')) syns.push('vegan plant-based');
    if (text.includes('gluten free') || text.includes('gf')) syns.push('gluten free gf');
    if (text.includes('nut free') || text.includes('nf')) syns.push('nut free nf');
    if (text.includes('dairy free') || text.includes('df')) syns.push('dairy free df');
    if (text.includes('soy free') || text.includes('sf')) syns.push('soy free sf');
    if (text.includes('bowl')) syns.push('bowl');
    if (text.includes('breakfast') || text.includes('morning') || text.includes('brunch')) syns.push('breakfast morning brunch');
    if (text.includes('sandwich') || text.includes('sub') || text.includes('hoagie')) syns.push('sandwich sub hoagie');
    if (text.includes('wrap') || text.includes('burrito')) syns.push('wrap burrito');
    if (text.includes('salad') || text.includes('greens')) syns.push('salad greens');
    if (text.includes('soup') || text.includes('bisque') || text.includes('broth')) syns.push('soup bisque broth');
    if (text.includes('acai') || text.includes('açaí') || text.includes('berry bowl')) syns.push('acai açaí berry bowl');
    if (text.includes('flatbread') || text.includes('pizza')) syns.push('flatbread pizza');
    if (text.includes('avocado') || text.includes('avo')) syns.push('avocado avo');
    if (text.includes('salmon')) syns.push('salmon');
    if (text.includes('chicken')) syns.push('chicken');

    return syns.join(' ');
  }
}

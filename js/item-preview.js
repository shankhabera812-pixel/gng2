import { getCustomizationKey, resolveImage } from './menu-render.js';

export function initItemPreview({ sections, customizations }) {
  const index = {};
  sections.forEach(sec => {
    sec.items.forEach(item => {
      index[getCustomizationKey(sec.id, item.name)] = { item, section: sec };
    });
  });

  const overlayHtml = `
    <div id="item-preview-overlay" class="item-preview-overlay" aria-hidden="true">
      <div class="item-preview-backdrop"></div>
      <div class="item-preview-modal" role="dialog" aria-modal="true" aria-labelledby="item-preview-name">
        <div class="item-preview-drag-handle"></div>
        <button class="item-preview-close" aria-label="Close preview">×</button>
        <div class="item-preview-content">
          <div class="item-preview-img-wrap"></div>
          <div class="item-preview-metadata">
            <span class="item-preview-badge" id="item-preview-section"></span>
            <h2 class="item-preview-name" id="item-preview-name"></h2>
            <div class="item-preview-price" id="item-preview-price"></div>
            <p class="item-preview-desc" id="item-preview-desc"></p>
            <div class="item-preview-tags" id="item-preview-tags"></div>
            <div class="item-preview-note" id="item-preview-note"></div>
          </div>
          <div class="item-preview-customizations" id="item-preview-customizations"></div>
          <div class="item-preview-cta-block" id="item-preview-cta-block">
            <p class="item-preview-cta-intro" id="item-preview-cta-intro"></p>
            <a href="menu.html" class="btn btn-secondary item-preview-explore-menu" id="item-preview-explore-menu" hidden>Explore full menu</a>
            <div class="item-preview-cta-buttons" id="item-preview-cta-buttons">
              <a href="https://order.toasttab.com/online/grill-and-green-worcester-141-highland-street" class="order-btn order-btn--toast" aria-label="Order on Toast" target="_blank" rel="noopener noreferrer">
                <img
                  class="order-btn__wordmark"
                  src="assets/images/order/toast-logo-white.svg"
                  alt=""
                  aria-hidden="true"
                  width="80"
                  height="22"
                  loading="lazy"
                >
              </a>
              <a href="https://www.doordash.com/store/grill-and-green-kitchen-worcester-34224401/?utm_campaign=gpa&rwg_token=AFd1xnE-txUF0f7iUgMiyNjNGYi-AOTA8s3OcXJ8QgxCacei0r2nY20U-uthtBy6Np3SNaKsHO2IwHWTFpjC9SCi6X9Oaf7iGg%3D%3D" class="order-btn order-btn--doordash" aria-label="Order on DoorDash" target="_blank" rel="noopener noreferrer">
                <img
                  class="order-btn__wordmark"
                  src="assets/images/order/doordash-logo-white.svg"
                  alt=""
                  aria-hidden="true"
                  width="120"
                  height="14"
                  loading="lazy"
                >
              </a>
              <a href="https://www.grubhub.com/restaurant/grill-and-green-worcester-141-highland-street-worcester/11665048?utm_source=google&utm_medium=organic&utm_campaign=place-action-link&delivery=true&rwg_token=AFd1xnFAirb7XZ7j82eFKfpBqMwoQ-y-EFIAI1xyaq_mUJ5X5xyuQU-6vN4raKmgbBKyIxf2b-PhqW5OS8ml-GfgbXZBESvqrQ%3D%3D" class="order-btn order-btn--grubhub" aria-label="Order on Grubhub" target="_blank" rel="noopener noreferrer">
                <img
                  class="order-btn__wordmark"
                  src="assets/images/order/grubhub-wordmark-white.svg"
                  alt=""
                  aria-hidden="true"
                  width="96"
                  height="20"
                  loading="lazy"
                >
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', overlayHtml);

  const overlay = document.getElementById('item-preview-overlay');
  const backdrop = overlay.querySelector('.item-preview-backdrop');
  const closeBtn = overlay.querySelector('.item-preview-close');
  const modal = overlay.querySelector('.item-preview-modal');
  let activeCard = null;

  function isDailyEditCard(card) {
    return card.classList.contains('daily-edit__card');
  }

  function openPreview(card) {
    const sectionId = card.dataset.sectionId;
    const itemSlug = card.dataset.itemSlug;
    const key = `${sectionId}--${itemSlug}`;
    const data = index[key];
    if (!data) return;

    const fromDailyEdit = isDailyEditCard(card);
    activeCard = card;
    const { item, section } = data;

    const imgWrap = overlay.querySelector('.item-preview-img-wrap');
    const imageData = resolveImage(item.name, section.id);
    if (imageData) {
      imgWrap.innerHTML = `<img src="${imageData.src}" alt="${imageData.alt}">`;
    } else {
      imgWrap.innerHTML = `<div class="item-preview-placeholder" style="background: var(--grove); width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 40px; opacity: 0.5;">🍽️</div>`;
    }

    overlay.querySelector('#item-preview-section').textContent = section.name;
    overlay.querySelector('#item-preview-name').textContent = item.name;
    overlay.querySelector('#item-preview-price').textContent = item.price;
    
    const descEl = overlay.querySelector('#item-preview-desc');
    if (item.desc) {
      descEl.textContent = item.desc;
      descEl.style.display = 'block';
    } else {
      descEl.style.display = 'none';
    }

    const tagsEl = overlay.querySelector('#item-preview-tags');
    if (item.tags && item.tags.length > 0) {
      tagsEl.innerHTML = item.tags.map(t => `<span class="chip chip--dietary">${t}</span>`).join('');
      tagsEl.style.display = 'flex';
    } else {
      tagsEl.style.display = 'none';
    }

    const noteEl = overlay.querySelector('#item-preview-note');
    if (item.note) {
      noteEl.textContent = item.note;
      noteEl.style.display = 'block';
    } else {
      noteEl.style.display = 'none';
    }

    const custEl = overlay.querySelector('#item-preview-customizations');
    custEl.innerHTML = '';
    const sectionCustom = customizations[section.id];
    const itemCustom = customizations[key];
    const customData = itemCustom || sectionCustom;

    if (customData) {
      for (const groupName in customData) {
        const group = customData[groupName];
        const groupEl = document.createElement('div');
        groupEl.className = 'item-preview-custom-group';
        
        const header = document.createElement('div');
        header.className = 'item-preview-custom-header';
        header.innerHTML = `<strong>${groupName}</strong> <span>${group.required ? 'Required' : 'Optional'}${group.max > 0 ? ` · Max ${group.max}` : ''}</span>`;
        groupEl.appendChild(header);

        const chips = document.createElement('div');
        chips.className = 'item-preview-custom-chips';
        for (const opt in group.options) {
          const price = group.options[opt];
          chips.innerHTML += `<span class="item-preview-custom-chip">${opt}${price > 0 ? ` <span class="price">+$${price.toFixed(2)}</span>` : ''}</span>`;
        }
        groupEl.appendChild(chips);
        custEl.appendChild(groupEl);
      }
    }

    const introEl = overlay.querySelector('#item-preview-cta-intro');
    const exploreBtn = overlay.querySelector('#item-preview-explore-menu');
    const buttonsEl = overlay.querySelector('#item-preview-cta-buttons');
    exploreBtn.hidden = !fromDailyEdit;

    if (!item.available) {
      introEl.textContent = 'Not available right now — check back soon.';
      buttonsEl.style.display = 'none';
      exploreBtn.hidden = true;
    } else {
      buttonsEl.style.display = '';
      if (fromDailyEdit) {
        introEl.textContent = 'Today\u2019s pick caught your eye? Add it to your order.';
      } else if (section.group === 'drinks') {
        introEl.textContent = 'Like what you see? Order it now.';
      } else {
        introEl.textContent = 'Hungry? Add it to your order.';
      }
    }

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closePreview() {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (activeCard) {
      activeCard.focus();
      activeCard = null;
    }
  }

  const menuSections = document.getElementById('menu-sections');
  if (menuSections) {
    menuSections.addEventListener('click', e => {
      const card = e.target.closest('.menu-card');
      if (card) openPreview(card);
    });

    menuSections.addEventListener('keydown', e => {
      const card = e.target.closest('.menu-card');
      if (card && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openPreview(card);
      }
    });
  }

  const dailyEdit = document.querySelector('.daily-edit');
  if (dailyEdit) {
    dailyEdit.addEventListener('click', e => {
      const card = e.target.closest('.daily-edit__card');
      if (!card) return;
      e.preventDefault();
      openPreview(card);
    });

    dailyEdit.addEventListener('keydown', e => {
      const card = e.target.closest('.daily-edit__card');
      if (card && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openPreview(card);
      }
    });
  }

  closeBtn.addEventListener('click', closePreview);
  backdrop.addEventListener('click', closePreview);
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePreview();
    if (e.key === 'Tab') {
      const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}

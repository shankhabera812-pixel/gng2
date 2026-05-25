/* ============================================================
   NAVIGATION
   Mobile overlay · focus trap · active link state
   ============================================================ */

export function initNav() {
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay   = document.querySelector('.nav__overlay');

  if (!hamburger || !overlay) return;

  const overlayLinks = overlay.querySelectorAll('.nav__overlay-link, .nav__overlay-cta');

  function openMenu() {
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Move focus into overlay
    const firstLink = overlay.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = overlay.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on overlay link tap
  overlayLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeMenu();
    }
  });

  // Focus trap inside overlay
  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = overlay.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

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
  });

  // Mark active link based on current page
  markActiveLinks();
}

function markActiveLinks() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav__link, .nav__overlay-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isHome   = href === 'index.html' || href === '/' || href === './';
    const isMenu   = href === 'menu.html' || href.includes('menu');
    const onHome   = currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('/');
    const onMenu   = currentPath.endsWith('menu.html');

    if ((isHome && onHome) || (isMenu && onMenu)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

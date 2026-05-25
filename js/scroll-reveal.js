/* ============================================================
   SCROLL REVEAL
   IntersectionObserver — fires at 80px into viewport
   Cards stagger at 70ms · Disconnects after each reveal (one-and-done)
   ============================================================ */

export function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Make everything visible immediately
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // Check if it's a stagger group container
        const staggerItems = el.querySelectorAll('.reveal-stagger');
        if (staggerItems.length > 0) {
          staggerItems.forEach((item, i) => {
            item.style.setProperty('--stagger-delay', `${i * 70}ms`);
            item.classList.add('revealed');
          });
        } else {
          el.classList.add('revealed');
        }

        observer.unobserve(el);
      });
    },
    {
      rootMargin: '0px 0px -80px 0px',
      threshold: 0
    }
  );

  // Observe all reveal elements — but not those already in the first viewport
  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      const rect = el.getBoundingClientRect();
      const inFirstViewport = rect.top < window.innerHeight && rect.bottom > 0;

      if (inFirstViewport) {
        // Don't animate things already visible on load
        el.classList.add('revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  });
}

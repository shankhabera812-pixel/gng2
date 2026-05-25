/* ============================================================
   REWARDS TOAST
   Dismiss with sessionStorage persistence across pages
   ============================================================ */

export function initRewardsToast() {
  const toast = document.querySelector('.rewards-toast');
  if (!toast) return;

  // If already dismissed this session, hide immediately
  if (sessionStorage.getItem('gng-toast-dismissed')) {
    toast.style.display = 'none';
    return;
  }

  const dismissBtn = toast.querySelector('.rewards-toast__dismiss');
  if (!dismissBtn) return;

  dismissBtn.addEventListener('click', () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      toast.style.display = 'none';
    } else {
      toast.classList.add('dismissing');
      toast.addEventListener('transitionend', () => {
        toast.style.display = 'none';
      }, { once: true });
    }

    sessionStorage.setItem('gng-toast-dismissed', '1');
  });
}

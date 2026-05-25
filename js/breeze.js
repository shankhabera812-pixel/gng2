/* ============================================================
   HERO BREEZE ANIMATION
   Word-by-word reveal — translateY(10px→0) + opacity(0→1)
   80ms stagger per word · one-shot on load
   ============================================================ */

export function initBreeze() {
  const headline = document.querySelector('.hero__headline');
  if (!headline) return;

  // Respect reduced motion — don't wrap words at all
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Wrap each word (space-separated) in a span with a stagger delay
  const html = headline.innerHTML;

  // Split by spaces but preserve <em> and other inline tags intact
  // We work on text nodes only, leaving HTML elements untouched
  wrapTextWords(headline, 80);
}

/**
 * Walks the DOM tree and wraps each whitespace-separated word
 * in a text node with a <span class="hero-word"> and a CSS --delay.
 * Leaves element nodes (like <em>) intact as a single unit.
 */
function wrapTextWords(container, staggerMs) {
  let wordIndex = 0;

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      words.forEach(part => {
        if (/^\s+$/.test(part) || part === '') {
          // Preserve whitespace as-is
          fragment.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'hero-word';
          span.textContent = part;
          span.style.setProperty('--delay', `${wordIndex * staggerMs}ms`);
          wordIndex++;
          fragment.appendChild(span);
        }
      });

      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Treat whole inline elements (em, strong) as a single word unit
      if (['EM', 'STRONG', 'SPAN', 'B', 'I'].includes(node.tagName)) {
        node.classList.add('hero-word');
        node.style.setProperty('--delay', `${wordIndex * staggerMs}ms`);
        wordIndex++;
      } else {
        // Walk children of block-like elements
        Array.from(node.childNodes).forEach(child => processNode(child));
      }
    }
  }

  Array.from(container.childNodes).forEach(child => processNode(child));
}

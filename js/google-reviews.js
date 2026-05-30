/**
 * Google Reviews Carousel
 * Renders curated Google reviews into a horizontal snap-scroll carousel
 * with dot indicators and desktop navigation arrows.
 * Zero dependencies — uses native scroll-snap + IntersectionObserver.
 */

const GOOGLE_ICON_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
</svg>`;

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
}

function createReviewCard(review) {
  const card = document.createElement('article');
  card.className = 'testimonial-card testimonial-card--google';
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', `Review by ${review.author}`);

  card.innerHTML = `
    <div class="testimonial-card__stars" aria-label="${review.rating} out of 5 stars">${renderStars(review.rating)}</div>
    <blockquote class="testimonial-card__quote">"${review.text}"</blockquote>
    <footer class="testimonial-card__footer">
      <div class="testimonial-card__avatar testimonial-card__avatar--google" aria-hidden="true">${review.profileInitial}</div>
      <div>
        <div class="testimonial-card__name">${review.author}</div>
        <div class="testimonial-card__meta testimonial-card__meta--google">
          ${GOOGLE_ICON_SVG}
          <span>Posted on Google · ${review.relativeTime}</span>
        </div>
      </div>
    </footer>
  `;
  return card;
}

function initDots(container, track, cards) {
  const dotsWrap = container.querySelector('.reviews-carousel__dots');
  if (!dotsWrap) return;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'reviews-carousel__dot';
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.reviews-carousel__dot');

  // IntersectionObserver to track which card is most visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(cards).indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, {
    root: track,
    threshold: 0.6
  });

  cards.forEach(card => observer.observe(card));
}

function initArrows(container, track, cards) {
  const prev = container.querySelector('.reviews-carousel__arrow--prev');
  const next = container.querySelector('.reviews-carousel__arrow--next');
  if (!prev || !next) return;

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -track.offsetWidth * 0.38, behavior: 'smooth' });
  });

  next.addEventListener('click', () => {
    track.scrollBy({ left: track.offsetWidth * 0.38, behavior: 'smooth' });
  });
}

export async function initGoogleReviews() {
  const container = document.querySelector('.reviews-carousel');
  if (!container) return;

  const track = container.querySelector('.reviews-carousel__track');
  if (!track) return;

  let data;
  try {
    const res = await fetch('data/google-reviews.json');
    data = await res.json();
  } catch (err) {
    console.warn('Could not load Google reviews:', err);
    return;
  }

  // Render rating into header
  const ratingEl = container.closest('.testimonials')?.querySelector('.reviews-rating-value');
  if (ratingEl) {
    ratingEl.textContent = data.averageRating;
  }

  const countEl = container.closest('.testimonials')?.querySelector('.reviews-total-count');
  if (countEl) {
    countEl.textContent = `${data.totalReviews} reviews`;
  }

  // Render cards
  data.reviews.forEach(review => {
    track.appendChild(createReviewCard(review));
  });

  const cards = track.querySelectorAll('.testimonial-card');

  // Init navigation
  initDots(container, track, cards);
  initArrows(container, track, cards);
}

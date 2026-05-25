/* ============================================================
   MENU RENDER
   Renders all sections and cards from data/menu.json
   Image mapper: manifest-based lookup + gradient placeholder fallback
   ============================================================ */

// ---- IMAGE LOOKUP TABLE ----
// Maps canonical menu item names (lowercase) → actual filename in assets/images/menu/
// Handles naming discrepancies between the menu data and the downloaded filenames
const IMAGE_MAP = {
  // Power Bowls
  'buddha bowl':                          'Buddha Bowl.jpg',
  'spring roll in a bowl':                'Spring Roll in a Bowl.jpg',
  'kingdom of life bowl':                 'Kingdom of Life Bowl.jpg',
  'beet bowl':                            'Beet Bowls.jpg',
  'honey sriracha salmon bowl':           'Honey Sriracha Salmon Bowl.jpg',
  'chicken avocado lime fajita bowl':     'Chicken Avocado Lime Fajita Bowl.jpg',
  'shrimp avocado lime fajita bowl':      'Shrimp Avocado Lime Fajita Bowl.jpg',
  'hummus bowl':                          'Hummus Bowl.jpg',
  'bang bang chicken bowl':               'Bang Bang Chicken Bowl.jpg',
  'bánh mì bowl':                         'BahnMi Bowl.jpg',
  'banh mi bowl':                         'BahnMi Bowl.jpg',
  // Grain Bowls
  'gochujang chicken bowl':               'Gochujang Chicken Bowl.jpg',
  'steak grain bowl':                     'Steak Grain Bowl.jpg',
  'vegan butternut squash grain bowl':    'Vegan Butternut Squash Grain Bowl.jpg',
  // Salads
  'caesar salad':                         'Caesar Salad.jpg',
  'kale beetroot salad':                  'Kale Beetroot Salad.jpg',
  'jaffa orange salad':                   'Jaffa Orange Salad.jpg',
  'greek salad':                          'Greek Salad.jpg',
  'cobb salad':                           'Cobb Salad.jpg',
  // Sandwiches
  'ham & cheese':                         'Ham & Cheese.jpg',
  'plain grilled cheese':                 'Plain Grilled Cheese.jpg',
  'apple mustard grilled cheese':         'Apple Mustard Grilled Cheese.jpg',
  'avocado melt':                         'Avocado Melt.jpg',
  'veggies sandwich':                     'Veggies Sandwich.jpg',
  'italiano ham':                         'Italiano Ham.jpg',
  'blt bagel sandwich':                   'BLT Bagel Sandwich.jpg',
  'turkey bacon sandwich':                'Turkey Bacon Sandwich.jpg',
  'grilled chicken bánh mì sandwich':     'Grill Chicken Sandwich Banhmi.jpg',
  'grilled chicken banh mi sandwich':     'Grill Chicken Sandwich Banhmi.jpg',
  'portobello & steak focaccia sandwich': null,
  // Wraps — no individual images, use section placeholder
  // Flatbreads
  'pepperoni flatbread':                  'Pepperoni Flatbread.jpg',
  'cheese flatbread':                     'Cheese Flatbread.jpg',
  'veggies flatbread':                    'Veggies Flatbread.jpg',
  'bbq chicken flatbread':                'BBQ Chicken Flatbread.jpg',
  // Breakfast
  'quiche':                               'Quiche.jpg',
  'yogurt & mixed fruit':                 'Yogurt & Mixed Fruit.jpg',
  'french toast':                         'French toast.jpg',
  'grill and green omelet':               'Grill and Green Omelet.jpg',
  'shakshuka':                            'Shakshuka.jpg',
  'waffle':                               'Waffle.jpg',
  'breakfast sandwich':                   'Breakfast Sandwich.png',
  // Toast
  'feta & garden veg toast':              'Feta & Garden Veg Toast.jpg',
  'house avocado toast':                  'House Avocado Toast.jpg',
  'mixed berry toast':                    'Mixed Berry Toast.jpg',
  'salmon toast':                         'Salmon toast.jpg',
  'labneh toast':                         'Lebneh Toast.jpg',
  'peanut butter toast':                  'Peanut Butter Toast.jpg',
  'almond butter toast':                  'Almond Butter Toast.jpg',
  // Soups
  'tomato bisque':                        'Tomato Bisque.jpg',
  'vegan lentil soup':                    'Vegan Lentil Soup.jpg',
  'miso soup':                            'Miso Soup.jpg',
  'creamy mushroom soup':                 'Creamy Mushroom Soup.jpg',
  // Açaí
  'berry açaí':                           'Berry Acai.jpg',
  'berry acai':                           'Berry Acai.jpg',
  'chocolate hazelnut açaí':              'Chocolate Hazelnut Acai.jpg',
  'chocolate hazelnut acai':              'Chocolate Hazelnut Acai.jpg',
  'build your açaí':                      'Build Your Acai.jpg',
  'build your acai':                      'Build Your Acai.jpg',
  // Baked
  'scones':                               'Scones.jpg',
  'cookies':                              'Cookies.jpg',
  'muffin':                               'Muffin.jpg',
  'brownies':                             'Brownies.jpg',
  'cinnamon rolls':                       'Cinnamon Rolls.jpg',
  'feta spinach croissant':               'Feta Spinach Croissant.jpg',
  'banana waffle nutella croissant':      'Banana Waffle Nutella Croissant.jpg',
  'plain bagel':                          null,
  // Snacks
  'mediterranean salad dip':              'Mediterranean Salad Dip.jpg',
  // Drinks — Smoothies
  'refresher smoothie':                   'Refresher Smoothies.jpg',
  'sun-joy smoothie':                     'Sun-joy Smoothies.jpg',
  'red bloom smoothie':                   'Red Bloom Smoothies.jpg',
  'paradise smoothie':                    'Paradise Smoothies.jpg',
  'tropical sunrise smoothie':            'Tropical Sunrise Smoothies.jpg',
  'berry pro smoothie':                   'Berry Pro Smoothies.jpg',
  'extravagance smoothie':                'Extravagance Smoothies.jpg',
  'turbo green smoothie':                 'Turbo Green Smoothies.jpg',
  'berry frenzy smoothie':                'Berry Frenzy Smoothies.jpg',
  'blue surge smoothie':                  'Blue Surge Smoothies.jpg',
  // Juices
  'organic lush juice (12oz)':            'Organic Lush Juice (12oz).jpg',
  'organic glow-up juice (12oz)':         'Organic Glow-Up Juice (12oz).jpg',
  'organic fire starter juice (12oz)':    'Organic Fire starter Juice (12oz).jpg',
  // Signature Brews
  'bangkok iced coffee (24oz)':           'Bangkok Iced Coffee (24oz).jpg',
  'bangkok sunshine (24oz)':              'Bangkok Sunshine (24oz).jpg',
  // Iced Coffee
  'iced americano':                       'Iced Americano.jpg',
  'iced caramel macchiato':               'Iced Caramel Macchiato.jpg',
  'iced matcha strawberry':               'Iced Matcha Strawberry.jpg',
  // Tea
  'hot golden milk tea':                  'Hot Golden Milk Tea.jpg',
  // Non-coffee
  'ichiko milk (iced strawberry milk)':   'Ichiko Milk (Iced Strawberry Milk).jpg',
  'cold-pressed cane juice':              'Cold-Pressed Cane Juice.jpg',
};

// Category-based gradient placeholders with emoji
const CATEGORY_PLACEHOLDERS = {
  'power-bowls':     { gradient: 'linear-gradient(135deg, #2E4226, #1D2B17)', emoji: '🥗' },
  'grain-bowls':     { gradient: 'linear-gradient(135deg, #3A2E1D, #1D2B17)', emoji: '🍚' },
  'salads':          { gradient: 'linear-gradient(135deg, #2A4020, #1D2B17)', emoji: '🥬' },
  'sandwiches':      { gradient: 'linear-gradient(135deg, #4A3020, #2A1A0E)', emoji: '🥪' },
  'wraps':           { gradient: 'linear-gradient(135deg, #4A3020, #2A1A0E)', emoji: '🌯' },
  'flatbread':       { gradient: 'linear-gradient(135deg, #4A3020, #2A1408)', emoji: '🫓' },
  'breakfast':       { gradient: 'linear-gradient(135deg, #4A3A20, #2A2010)', emoji: '🍳' },
  'toast':           { gradient: 'linear-gradient(135deg, #4A3828, #2A2018)', emoji: '🍞' },
  'soups':           { gradient: 'linear-gradient(135deg, #4A2A18, #2A1408)', emoji: '🍲' },
  'acai':            { gradient: 'linear-gradient(135deg, #5A2080, #3A1060)', emoji: '🫐' },
  'baked':           { gradient: 'linear-gradient(135deg, #4A3020, #2A1C10)', emoji: '🥐' },
  'snacks':          { gradient: 'linear-gradient(135deg, #3A3A20, #1A1A10)', emoji: '🥙' },
  'sides':           { gradient: 'linear-gradient(135deg, #2A3020, #141E10)', emoji: '🥦' },
  'fruit-smoothies': { gradient: 'linear-gradient(135deg, #6A2040, #3A1020)', emoji: '🍓' },
  'power-smoothies': { gradient: 'linear-gradient(135deg, #1A4A30, #0A2A18)', emoji: '💚' },
  'juices':          { gradient: 'linear-gradient(135deg, #4A6A10, #283A08)', emoji: '🍊' },
  'wellness-shots':  { gradient: 'linear-gradient(135deg, #5A4A10, #2A2A08)', emoji: '💉' },
  'signature-brews': { gradient: 'linear-gradient(135deg, #2A1810, #140C06)', emoji: '☕' },
  'iced-coffee':     { gradient: 'linear-gradient(135deg, #1A2A38, #0A1A28)', emoji: '🧊' },
  'hot-coffee':      { gradient: 'linear-gradient(135deg, #2A1810, #140C06)', emoji: '☕' },
  'frappes':         { gradient: 'linear-gradient(135deg, #1A2030, #0A1020)', emoji: '🥤' },
  'hot-tea':         { gradient: 'linear-gradient(135deg, #2A3818, #141E0A)', emoji: '🍵' },
  'iced-tea':        { gradient: 'linear-gradient(135deg, #1A3830, #0A1E18)', emoji: '🧃' },
  'non-coffee':      { gradient: 'linear-gradient(135deg, #2A1828, #140C14)', emoji: '🫧' },
};

// Dietary tag full labels
const TAG_LABELS = {
  GF: 'Gluten-Free',
  DF: 'Dairy-Free',
  NF: 'Nut-Free',
  SF: 'Soy-Free',
  VG: 'Vegan',
  V:  'Vegetarian',
};

/**
 * Resolve image src for a given item name + section id.
 * Returns { src, alt } or null if no image (use placeholder).
 */
function resolveImage(itemName, sectionId) {
  const key = itemName.toLowerCase().trim();
  const filename = IMAGE_MAP[key];

  // Explicit null means intentionally no image
  if (filename === null) return null;
  // undefined key = attempt auto-resolution by normalized filename
  if (filename === undefined) return null;

  return {
    src: `assets/images/menu/${encodeURIComponent(filename)}`,
    alt: `${itemName} — ${itemName}`,
  };
}

/**
 * Build the placeholder element for items without photos.
 */
function buildPlaceholder(sectionId, itemName) {
  const ph = CATEGORY_PLACEHOLDERS[sectionId] || { gradient: 'linear-gradient(135deg, #2E4226, #1D2B17)', emoji: '🍽️' };
  const div = document.createElement('div');
  div.className = 'menu-card__placeholder';
  div.style.background = ph.gradient;
  div.setAttribute('aria-hidden', 'true');
  div.innerHTML = `<span style="opacity:0.22;font-size:40px;filter:grayscale(30%)">${ph.emoji}</span>`;
  return div;
}

/**
 * Build a single menu card DOM element.
 */
function buildCard(item, sectionId) {
  const card = document.createElement('article');
  card.className = 'menu-card';
  if (!item.available) card.classList.add('unavailable');

  // Data attributes for filtering
  if (item.tags && item.tags.length > 0) {
    card.dataset.tags = item.tags.join(',');
  }

  // ---- Image area ----
  const imgWrap = document.createElement('div');
  imgWrap.className = 'menu-card__img-wrap';

  const imageData = resolveImage(item.name, sectionId);
  if (imageData) {
    const img = document.createElement('img');
    img.className = 'menu-card__img';
    img.src = imageData.src;
    img.alt = `${item.name}${item.desc ? ' — ' + item.desc.slice(0, 80) : ''}`;
    img.loading = 'lazy';
    img.width = 400;
    img.height = 190;
    imgWrap.appendChild(img);
  } else {
    imgWrap.appendChild(buildPlaceholder(sectionId, item.name));
  }

  // Badge
  if (!item.available) {
    const badge = document.createElement('span');
    badge.className = 'badge badge--unavailable';
    badge.textContent = 'Unavailable';
    badge.setAttribute('aria-label', 'Currently unavailable');
    imgWrap.appendChild(badge);
  } else if (item.badge === 'special') {
    const badge = document.createElement('span');
    badge.className = 'badge badge--special';
    badge.textContent = "Today's Special";
    imgWrap.appendChild(badge);
  } else if (item.badge === 'new') {
    const badge = document.createElement('span');
    badge.className = 'badge badge--new';
    badge.textContent = 'New';
    imgWrap.appendChild(badge);
  }

  card.appendChild(imgWrap);

  // ---- Body ----
  const body = document.createElement('div');
  body.className = 'menu-card__body';

  // Name + Price row
  const nameRow = document.createElement('div');
  nameRow.className = 'menu-card__name-row';

  const name = document.createElement('h3');
  name.className = 'menu-card__name';
  name.textContent = item.name;

  const price = document.createElement('span');
  price.className = 'menu-card__price';
  price.textContent = item.price;

  nameRow.appendChild(name);
  nameRow.appendChild(price);
  body.appendChild(nameRow);

  // Description
  if (item.desc) {
    const desc = document.createElement('p');
    desc.className = 'menu-card__desc';
    desc.textContent = item.desc;
    body.appendChild(desc);
  }

  // Allergen note (if any)
  if (item.note) {
    const note = document.createElement('p');
    note.className = 'menu-card__note';
    note.style.cssText = 'font-size:11px;color:var(--ember);font-style:italic;margin-top:4px;';
    note.textContent = item.note;
    body.appendChild(note);
  }

  // Dietary tags — max 3 visible, +N overflow
  if (item.tags && item.tags.length > 0) {
    const tagsEl = document.createElement('div');
    tagsEl.className = 'menu-card__tags';

    const visible = item.tags.slice(0, 3);
    const overflow = item.tags.length - 3;

    visible.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'chip chip--dietary';
      chip.textContent = tag;
      chip.setAttribute('title', TAG_LABELS[tag] || tag);
      tagsEl.appendChild(chip);
    });

    if (overflow > 0) {
      const more = document.createElement('span');
      more.className = 'chip chip--overflow';
      more.textContent = `+${overflow}`;
      more.setAttribute('title', item.tags.slice(3).map(t => TAG_LABELS[t] || t).join(', '));
      tagsEl.appendChild(more);
    }

    body.appendChild(tagsEl);
  }

  // Sizing callout (acai, smoothies, coffee)
  if (item.sizes) {
    const sizes = document.createElement('div');
    sizes.className = 'menu-card__sizes';
    sizes.innerHTML = `<strong>Size:</strong> ${item.sizes}`;
    body.appendChild(sizes);
  }

  card.appendChild(body);

  // Wrap with stagger class for scroll reveal
  card.classList.add('reveal-stagger');

  return card;
}

/**
 * Build a full section element from section data.
 */
function buildSection(section) {
  const sec = document.createElement('section');
  sec.id = section.id;
  sec.className = 'menu-section';
  sec.setAttribute('aria-label', section.name);
  // Stamp data-group so tab-panels.js can find drinks / food sections
  sec.dataset.group = section.group || 'food';
  if (section.group === 'drinks') sec.dataset.drinksSub = section.drinksSub || '';

  // Header
  const header = document.createElement('div');
  header.className = 'menu-section__header container';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'menu-section__eyebrow';
  eyebrow.textContent = `${section.name} · ${section.eyebrow}`;
  header.appendChild(eyebrow);

  const title = document.createElement('h2');
  title.className = 'menu-section__title';
  title.textContent = section.title;
  header.appendChild(title);

  if (section.description) {
    const desc = document.createElement('p');
    if (section.description.length > 80 && section.description.includes('$')) {
      desc.className = 'menu-section__note';
    } else {
      desc.className = 'menu-section__sub';
    }
    desc.textContent = section.description;
    header.appendChild(desc);
  }

  sec.appendChild(header);

  // Grid
  const grid = document.createElement('div');
  const isCompact = section.compact;
  grid.className = `container menu-section__grid${isCompact ? ' menu-section__grid--compact' : ''}`;

  section.items.forEach(item => {
    const card = buildCard(item, section.id);
    grid.appendChild(card);
  });

  sec.appendChild(grid);
  return sec;
}

/**
 * Main render function — fetches menu.json and populates #menu-sections.
 * Clears the container first, then renders all section elements.
 * All sections start hidden; tab-panels.js activates the first one.
 */
export async function renderMenu() {
  const container = document.getElementById('menu-sections');
  if (!container) return;

  // Clear any placeholder content (loading state, previous renders)
  container.innerHTML = '';

  let data;
  try {
    const res = await fetch('data/menu.json');
    data = await res.json();
  } catch (err) {
    console.error('Failed to load menu data', err);
    container.innerHTML = '<p style="text-align:center;padding:60px 20px;color:var(--dust);font-family:var(--ff-body);font-size:16px;font-weight:300;">Could not load menu — please refresh.</p>';
    return;
  }

  // Render all sections (all hidden by default via CSS .menu-section { display:none })
  data.sections.forEach(section => {
    const el = buildSection(section);
    container.appendChild(el);
  });

  return data.sections;
}

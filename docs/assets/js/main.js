/* Minimal progressive enhancement:
   - Mobile nav toggle
   - Theme toggle (respects system preference)
   - Tag filtering for Work cards
   - Year in footer
*/

(function () {
  // ===== Mobile nav toggle =====
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-expanded', String(!expanded));
    });

    // Close on outside click (small screens)
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Year in footer =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Theme toggle =====
  const THEME_KEY = 'csm-theme';
  const themeToggle = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // initial theme from storage or system
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  // ===== Work tag filters =====
  const chips = document.querySelectorAll('.filters .chip');
  const cards = document.querySelectorAll('#work-grid .card');

  function setActiveChip(target) {
    chips.forEach(c => {
      const active = c === target;
      c.classList.toggle('is-active', active);
      c.setAttribute('aria-pressed', String(active));
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      setActiveChip(chip);
      const f = chip.dataset.filter;
      cards.forEach(card => {
        if (f === 'all') {
          card.hidden = false;
          return;
        }
        const tags = (card.dataset.tags || '').split(/\s+/);
        card.hidden = !tags.includes(f);
      });
    });
  });

  // Keyboard users: ensure skip link works with sticky header
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', () => {
      const main = document.getElementById('main');
      if (main) main.setAttribute('tabindex', '-1'), main.focus();
    });
  }
})();


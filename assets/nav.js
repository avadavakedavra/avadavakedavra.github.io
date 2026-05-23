// Navbar loader — SEHR Academy
// Place at /assets/nav.js
// Usage on any page:
//   <header id="site-header"></header>
//   <script src="/assets/nav.js" defer></script>

(async function () {
  'use strict';
  const host = document.querySelector('header#site-header');
  if (!host) return;

  try {
    const res = await fetch('/partials/nav.html', { cache: 'no-cache' });
    if (!res.ok) throw new Error('nav fetch failed: ' + res.status);
    const html = await res.text();
    host.innerHTML = html;

    // Re-execute inline <script> tags (fetched HTML scripts don't auto-run)
    host.querySelectorAll('script').forEach(function (s) {
      const n = document.createElement('script');
      if (s.src) { n.src = s.src; } else { n.textContent = s.textContent; }
      s.replaceWith(n);
    });

    // Highlight the nav link matching the current page
    const currentPath = window.location.pathname
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/';

    host.querySelectorAll('.sh-link, .sh-submenu a').forEach(function (a) {
      try {
        const linkPath = new URL(a.href).pathname
          .replace(/\.html$/, '')
          .replace(/\/$/, '') || '/';
        if (linkPath === currentPath) {
          a.classList.add('active-page');
          a.setAttribute('aria-current', 'page');
          // Also activate the parent trigger if link is inside a dropdown
          const parentTrigger = a.closest('.sh-submenu')
            ?.closest('li')
            ?.querySelector('.sh-trigger');
          if (parentTrigger) parentTrigger.classList.add('active-page');
        }
      } catch (e) {}
    });

  } catch (e) {
    console.warn('SEHR nav load failed:', e);
    host.innerHTML = '<div style="padding:12px;font-family:Montserrat,sans-serif;font-size:12px;color:rgba(255,255,255,.4);background:#1a1a18">Navigation unavailable.</div>';
  }
})();

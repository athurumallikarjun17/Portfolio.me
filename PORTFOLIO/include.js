(function () {
  'use strict';

  async function loadInclude(el) {
    const src = el.getAttribute('data-include');
    if (!src) return;
    try {
      const res = await fetch(src, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load: ${src} (${res.status})`);
      const html = await res.text();
      el.innerHTML = html;

      // Hide fallback if present
      const fallback = el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains('header-fallback') ? el.nextElementSibling : null;
      if (fallback) fallback.classList.add('d-none');

      // Re-execute script tags so they run in the main document context
      const scripts = Array.from(el.querySelectorAll('script'));
      for (const oldScript of scripts) {
        const newScript = document.createElement('script');
        // copy attributes
        for (const attr of oldScript.attributes) newScript.setAttribute(attr.name, attr.value);
        if (oldScript.src) {
          newScript.src = oldScript.src;
          // ensure async/ordering consistent with original
          newScript.async = oldScript.async;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }

    } catch (err) {
      console.warn('include.js: error loading', src, err);
      const fallback = el.nextElementSibling && el.nextElementSibling.classList && el.nextElementSibling.classList.contains('header-fallback') ? el.nextElementSibling : null;
      if (fallback) {
        fallback.classList.remove('d-none');
      } else {
        el.innerHTML = '';
      }
    }
  }

  function highlightNav() {
    // Match current file name (e.g., index.html). If root or empty, treat as index.html
    const path = (window.location.pathname || '').split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav .nav-link');
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
      if (!href) return;
      if (href === path || (href === 'index.html' && (path === '' || path === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const includes = Array.from(document.querySelectorAll('[data-include]'));
    if (!includes.length) {
      // still run highlight in case navs are inline
      highlightNav();
      return;
    }

    // Load all includes and then run highlight
    Promise.all(includes.map(loadInclude)).then(() => {
      highlightNav();
      // Allow pages to register a callback
      if (typeof window.onIncludesLoaded === 'function') window.onIncludesLoaded();
    });
  });
})();

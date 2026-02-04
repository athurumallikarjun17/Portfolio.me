document.addEventListener('DOMContentLoaded', function () {
  const emailEl = document.getElementById('resume-email');
  const copyBtn = document.getElementById('copy-email-btn');
  const printBtn = document.getElementById('print-btn');
  const openPdfBtn = document.getElementById('open-pdf-btn');
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, variant = 'secondary') {
    if (!toastContainer) return;
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${variant} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    toastContainer.appendChild(toastEl);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
    bsToast.show();
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
  }

  // Copy email to clipboard
  if (copyBtn && emailEl) {
    copyBtn.addEventListener('click', async function () {
      const text = emailEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast('Email copied to clipboard ✅', 'primary');
        copyBtn.setAttribute('aria-label', 'Email copied');
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast('Email copied to clipboard ✅', 'primary');
        } catch (err2) {
          showToast('Unable to copy email', 'danger');
        }
        textarea.remove();
      }
    });
  }

  // Print button
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
      showToast('Print dialog opened', 'secondary');
    });
  }

  // PDF buttons: show small toast when clicked
  if (openPdfBtn) {
    openPdfBtn.addEventListener('click', function () {
      showToast('Opening PDF...', 'secondary');
    });
  }
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', function () {
      showToast('Downloading PDF...', 'secondary');
    });
  }

  // Ensure nav highlights the current page
  (function highlightNav() {
    const navLinks = document.querySelectorAll('nav .nav-link');
    if (!navLinks.length) return;
    const current = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
      // Normalize href (ignore query/hash)
      const href = link.getAttribute('href') ? link.getAttribute('href').split('?')[0].split('#')[0] : '';
      if (!href) return;
      if (href === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

});

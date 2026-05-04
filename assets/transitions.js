(function () {
  const smooth = 'cubic-bezier(0.4, 0, 0.2, 1)';

  /* ── Parse this page's display title ── */
  const raw = document.title;
  const pageTitle = raw.includes(' — ') ? raw.split(' — ').pop().trim() : 'Enterprise Firewall 7.6';

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    .pt-overlay {
      position: fixed;
      inset: 0;
      background: #1a1209;
      z-index: 99999;
      pointer-events: none;
      will-change: transform;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .pt-brand {
      font-family: 'Fraunces', serif;
      font-size: 38px;
      font-weight: 700;
      color: #fef9f0;
      letter-spacing: -0.01em;
      line-height: 1;
    }
    .pt-brand span { color: #ff6b35; }
    .pt-rule {
      width: 28px;
      height: 2px;
      background: #ff6b35;
      border-radius: 2px;
      opacity: 0.6;
    }
    .pt-page {
      font-family: 'Fraunces', serif;
      font-size: 17px;
      font-style: italic;
      font-weight: 400;
      color: #8a7660;
    }
  `;
  document.head.appendChild(style);

  /* ── Overlay ── */
  const ov = document.createElement('div');
  ov.className = 'pt-overlay';
  ov.innerHTML = `
    <div class="pt-brand">NSE7<span>.</span></div>
    <div class="pt-rule"></div>
    <div class="pt-page">${pageTitle}</div>
  `;
  document.body.appendChild(ov);

  /* ── Page enter ──
     Clear the sessionStorage flag and pt-init class (body is now safe to show
     since the overlay is covering it), then lift the overlay away. */
  sessionStorage.removeItem('pt');
  document.documentElement.classList.remove('pt-init');

  ov.style.transform = 'translateY(0)';

  setTimeout(() => {
    ov.style.transition = `transform 0.42s ${smooth}`;
    ov.style.transform = 'translateY(-100%)';
  }, 340);

  /* ── Page exit: immediately cover screen, then navigate ──
     No slide-in animation — snapping the overlay to full coverage eliminates
     any content flash. The enter animation on the next page handles the reveal. */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || /^(https?:|mailto:|javascript:)/.test(href)) return;
    e.preventDefault();

    sessionStorage.setItem('pt', '1');

    ov.style.transition = 'none';
    ov.style.transform = 'translateY(0)';

    // Two rAF frames guarantee the overlay is painted before navigation fires
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.location.href = href;
      });
    });
  }, true);

  /* ── Back/forward navigation ──
     pagehide: set the pt flag so a full-reload back shows the overlay on entry.
     pageshow (persisted): page was restored from bfcache — scripts didn't re-run,
     so we manually snap the overlay in and animate it away. */
  window.addEventListener('pagehide', () => {
    sessionStorage.setItem('pt', '1');
  });

  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    sessionStorage.removeItem('pt');
    ov.style.transition = 'none';
    ov.style.transform = 'translateY(0)';
    setTimeout(() => {
      ov.style.transition = `transform 0.42s ${smooth}`;
      ov.style.transform = 'translateY(-100%)';
    }, 340);
  });
})();

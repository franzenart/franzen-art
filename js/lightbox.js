import { CONFIG } from './config.js';

export const LightboxManager = (() => {
  let itens = [];
  let atual = 0;
  let preloadedUrls = new Set();

  let touchStartX = 0, touchStartY = 0;
  let isZoomed = false, scale = 1, startX = 0, startY = 0, moveX = 0, moveY = 0;

  const DOM = {};

  const init = (galleryItems) => {
    itens = galleryItems;
    DOM.lightbox = document.getElementById('lightbox');
    DOM.img = document.getElementById('lightbox-img');
    DOM.wrapper = document.getElementById('lightbox-wrapper');
    DOM.caption = document.getElementById('lightbox-caption');
    DOM.counter = document.getElementById('lightbox-counter');
    DOM.close = document.getElementById('lightbox-close');
    DOM.prev = document.getElementById('lightbox-prev');
    DOM.next = document.getElementById('lightbox-next');

    if (!DOM.lightbox) return;

    itens.forEach((item, index) => item.addEventListener('click', () => abrir(index)));
    DOM.close.addEventListener('click', fechar);
    DOM.prev.addEventListener('click', ant);
    DOM.next.addEventListener('click', prox);
    DOM.lightbox.addEventListener('click', (e) => { if (e.target === DOM.lightbox) fechar(); });

    window.addEventListener('keydown', teclado);
    setupGestures();
  };

  const abrir = (idx) => {
    atual = idx;
    DOM.lightbox.classList.add('active');
    DOM.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    render();
  };

  const fechar = () => {
    DOM.lightbox.classList.remove('active');
    DOM.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetZoom();
  };

  const render = () => {
    const item = itens[atual];
    if (!item) return;
    const originalImg = item.querySelector('img');
    DOM.img.src = originalImg.src;
    DOM.img.alt = originalImg.alt;
    DOM.caption.textContent = item.querySelector('.caption')?.textContent || '';
    DOM.counter.textContent = `${atual + 1} / ${itens.length}`;
    preloadNextAndPrev();
  };

  const preloadNextAndPrev = () => {
    const nxt = (atual + 1) % itens.length;
    const src = itens[nxt]?.querySelector('img')?.src;
    if (src && !preloadedUrls.has(src)) {
      preloadedUrls.add(src);
      const link = document.createElement('link'); link.rel = 'preload'; link.as = 'image'; link.href = src;
      document.head.appendChild(link);
    }
  };

  const prox = () => { if(isZoomed) resetZoom(); atual = (atual + 1) % itens.length; render(); };
  const ant = () => { if(isZoomed) resetZoom(); atual = (atual - 1 + itens.length) % itens.length; render(); };

  const setupGestures = () => {
    let lastTap = 0;
    DOM.wrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        if(isZoomed) { startX = e.touches[0].clientX - moveX; startY = e.touches[0].clientY - moveY; }
      }
    }, {passive: true});

    DOM.wrapper.addEventListener('touchmove', (e) => {
      if (isZoomed && e.touches.length === 1) {
        moveX = e.touches[0].clientX - startX;
        moveY = e.touches[0].clientY - startY;
        DOM.img.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
      }
    }, {passive: true});

    DOM.wrapper.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        toggleZoom();
      } else if (!isZoomed) {
        const diffX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diffX) > CONFIG.SWIPE_THRESHOLD) {
          if (diffX > 0) {
            ant();
          } else {
            prox();
          }
        }
      }
      lastTap = now;
    }, {passive: true});
  };

  const toggleZoom = () => {
    if (isZoomed) { resetZoom(); } else { isZoomed = true; scale = 2.2; DOM.img.style.transform = `scale(${scale})`; }
  };

  const resetZoom = () => { isZoomed = false; scale = 1; moveX = 0; moveY = 0; DOM.img.style.transform = 'none'; };
  const teclado = (e) => {
    if (!DOM.lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowRight') prox();
    if (e.key === 'ArrowLeft') ant();
  };

  return { init };
})();

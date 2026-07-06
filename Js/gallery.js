import { CONFIG } from './config.js';

export const GalleryManager = (() => {
  let itens = [];

  const init = (galleryItems) => {
    itens = galleryItems;
    const salvo = localStorage.getItem(CONFIG.FILTER_KEY);
    if (salvo) {
      const btn = document.querySelector(`[data-category="${salvo}"]`);
      if (btn) aplicar(btn, salvo);
    }
  };

  const aplicar = (botao, categoria) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    botao.classList.add('active');
    itens.forEach(item => {
      item.classList.toggle('hidden', categoria !== 'tudo' && !item.classList.contains(categoria));
    });
  };

  const filtrar = (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const cat = btn.dataset.category;
    aplicar(btn, cat);
    localStorage.setItem(CONFIG.FILTER_KEY, cat);
  };

  return { init, filtrar };
})();


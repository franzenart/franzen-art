import { CONFIG } from './config.js';

export const ThemeManager = (() => {
  const init = () => {
    const salvo = localStorage.getItem(CONFIG.THEME_KEY);
    if (salvo === 'pb' || (!salvo && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('tema-pb');
    }
    document.getElementById('btn-theme')?.addEventListener('click', toggle);
  };

  const toggle = () => {
    const body = document.body;
    body.classList.toggle('tema-pb');
    localStorage.setItem(CONFIG.THEME_KEY, body.classList.contains('tema-pb') ? 'pb' : 'artistico');
  };

  return { init };
})();


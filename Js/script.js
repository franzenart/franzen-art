import { ThemeManager } from './theme.js';
import { GalleryManager } from './gallery.js';
import { ClipboardManager } from './clipboard.js';
import { LightboxManager } from './lightbox.js';
import { debounce } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  
  ThemeManager.init();
  GalleryManager.init(items);
  ClipboardManager.init();
  LightboxManager.init(items);

  document.getElementById('filter-container')?.addEventListener('click', GalleryManager.filtrar);

  const btnHome = document.getElementById('btn-home');
  const reveals = document.querySelectorAll('.scroll-reveal');

  const checkScroll = () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 400) {
      btnHome?.classList.add('visible');
      btnHome?.setAttribute('aria-hidden', 'false');
    } else {
      btnHome?.classList.remove('visible');
      btnHome?.setAttribute('aria-hidden', 'true');
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.88) el.classList.add('revealed');
      });
    }
  };

  btnHome?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  
  window.addEventListener('scroll', debounce(checkScroll, 15));
  checkScroll();
});

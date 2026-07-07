document.addEventListener('DOMContentLoaded', () => {

  // --- ABAS DA GALERIA ---
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      const targetId = `category-${tab.dataset.target}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // --- ALTERNAR TEMA ---
  const btnTheme = document.getElementById('btn-theme');
  
  if (localStorage.getItem('franzen_theme_pref') === 'pb') {
    document.body.classList.add('tema-pb');
  }

  btnTheme?.addEventListener('click', () => {
    document.body.classList.toggle('tema-pb');
    const isPB = document.body.classList.contains('tema-pb');
    localStorage.setItem('franzen_theme_pref', isPB ? 'pb' : 'artistico');
    showToast(isPB ? "Modo Minimalista P&B ativado" : "Modo Portfólio Artístico ativado");
  });

  // --- CLIPBOARD ---
  const btnCopy = document.getElementById('btn-copy-link');
  btnCopy?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast("✔ Link do portfólio copiado!"))
      .catch(() => showToast("Erro ao copiar link."));
  });

  // --- SISTEMA TOAST ---
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    container.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    
    setTimeout(() => { if(toast) toast.remove(); }, 2900);
  }

  // --- LIGHTBOX GALERIA ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  let currentCards = [];
  let currentIndex = 0;

  const syncGalleryContext = () => {
    const activeSection = document.querySelector('.tab-content.active');
    if (activeSection) {
      currentCards = Array.from(activeSection.querySelectorAll('.art-card'));
    }
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.art-card');
    if (!card) return;
    
    syncGalleryContext();
    currentIndex = currentCards.indexOf(card);
    openLightbox(card);
  });

  const openLightbox = (card) => {
    if (!card) return;
    lightboxImg.src = card.dataset.full;
    lightboxCaption.textContent = card.dataset.caption;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const moveNext = () => {
    if (currentCards.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentCards.length;
    openLightbox(currentCards[currentIndex]);
  };

  const movePrev = () => {
    if (currentCards.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
    openLightbox(currentCards[currentIndex]);
  };

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', moveNext);
  prevBtn?.addEventListener('click', movePrev);
  
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') moveNext();
    if (e.key === 'ArrowLeft') movePrev();
  });

  // --- BACK TO TOP SCROLL ---
  const btnHome = document.getElementById('btn-home');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btnHome?.classList.add('visible');
      btnHome?.setAttribute('aria-hidden', 'false');
    } else {
      btnHome?.classList.remove('visible');
      btnHome?.setAttribute('aria-hidden', 'true');
    }
  }, { passive: true });

  btnHome?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
      

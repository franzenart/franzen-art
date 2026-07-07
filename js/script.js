/**
 * Experiência Imersiva FranzenArt 2026
 * Arquivo estritamente modular focado em performance Lighthouse e segurança estática
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- MÓDULO 1: CURSOR DE LÁPIS SEGUIDOR ---
  const cursor = document.getElementById('custom-pencil-cursor');
  document.addEventListener('mousemove', (e) => {
    if (cursor) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }
  });

  // --- MÓDULO 2: PROGRESSO DE LEITURA E CINEMATIC REVEAL ---
  const progressBar = document.getElementById('scroll-progress');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const handleScrollEffects = () => {
    // Barra superior
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && progressBar) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Efeito de surgimento suave das seções
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < window.innerHeight * 0.88) {
        el.classList.add('visible');
      }
    });

    // Botão Voltar ao Topo
    const btnHome = document.getElementById('btn-home');
    if (window.scrollY > 400) {
      btnHome?.classList.add('visible');
    } else {
      btnHome?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects(); // Execução inicial

  // --- MÓDULO 3: FILTRO DE ABAS E BUSCA DINÂMICA INTEGRADA ---
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.art-card');
  const searchInput = document.getElementById('gallery-search');
  let currentActiveCategory = 'all';

  const filterGallery = () => {
    const query = searchInput?.value.toLowerCase().trim() || "";
    
    cards.forEach(card => {
      const categoryMatch = currentActiveCategory === 'all' || card.dataset.category === currentActiveCategory;
      const searchMatch = card.dataset.title.includes(query);
      
      if (categoryMatch && searchMatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      currentActiveCategory = tab.dataset.target;
      filterGallery();
    });
  });

  searchInput?.addEventListener('input', filterGallery);

  // --- MÓDULO 4: MECÂNICA DE FAVORITOS (LOCALSTORAGE SEGURO) ---
  const favButtons = document.querySelectorAll('.btn-fav');
  
  // Inicializar estados
  favButtons.forEach(btn => {
    const id = btn.dataset.favId;
    if (localStorage.getItem(`fav_${id}`) === 'true') {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita disparar o Lightbox ao favoritar
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      localStorage.setItem(`fav_${id}`, isActive ? 'true' : 'false');
      showToast(isActive ? "Obra favoritada no seu navegador!" : "Removido dos favoritos.");
    });
  });

  // --- MÓDULO 5: CICLO DE TEMAS AVANÇADOS ---
  const btnTheme = document.getElementById('btn-theme');
  const themeText = document.getElementById('theme-text');
  const themes = ['artistico', 'pb', 'papel'];
  let currentThemeIdx = themes.indexOf(document.body.getAttribute('data-theme') || 'artistico');

  // Recupera do cache do navegador se houver
  const cachedTheme = localStorage.getItem('franzen_art_theme');
  if (cachedTheme && themes.includes(cachedTheme)) {
    document.body.setAttribute('data-theme', cachedTheme);
    currentThemeIdx = themes.indexOf(cachedTheme);
    if(themeText) themeText.textContent = `Tema: ${cachedTheme.toUpperCase()}`;
  }

  btnTheme?.addEventListener('click', () => {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    const nextTheme = themes[currentThemeIdx];
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('franzen_art_theme', nextTheme);
    if(themeText) themeText.textContent = `Tema: ${nextTheme.toUpperCase()}`;
    showToast(`Visual alterado para modo ${nextTheme}`);
  });

  // --- MÓDULO 6: CENTRAL TOAST ---
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    container.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => { if(toast) toast.remove(); }, 2800);
  }

  // --- MÓDULO 7: LIGHTBOX PREMIUM TOTAL ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  
  let visibleCards = [];
  let currentIndex = 0;

  const updateLightboxContent = () => {
    if (visibleCards.length === 0) return;
    const card = visibleCards[currentIndex];
    if (lightboxImg) lightboxImg.src = card.dataset.full;
    if (lightboxCaption) lightboxCaption.textContent = card.dataset.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${visibleCards.length}`;
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.art-card');
    if (!card) return;
    
    // Filtra apenas as imagens que estão aparecendo na tela no momento atual
    visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
    currentIndex = visibleCards.indexOf(card);
    
    if (currentIndex !== -1 && lightbox) {
      updateLightboxContent();
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('lightbox-next')?.addEventListener('click', () => {
    if(visibleCards.length <= 1) return;
    currentIndex = (currentIndex + 1) % visibleCards.length;
    updateLightboxContent();
  });
  document.getElementById('lightbox-prev')?.addEventListener('click', () => {
    if(visibleCards.length <= 1) return;
    currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    updateLightboxContent();
  });

  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') document.getElementById('lightbox-next')?.click();
    if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev')?.click();
  });

  // Copiar link externo
  document.getElementById('btn-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast("✔ Link copiado com sucesso!"))
      .catch(() => showToast("Erro ao copiar link."));
  });

  document.getElementById('btn-home')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
                          

/**
 * Core Modular da Experiência FranzenArt 2026
 * Estritamente em conformidade com segurança estática e performance pura.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. CURSOR SEGUIDOR EM FORMA DE LÁPIS ---
  const pencilCursor = document.getElementById('custom-pencil-cursor');
  document.addEventListener('mousemove', (e) => {
    if (pencilCursor) {
      pencilCursor.style.left = e.clientX + 'px';
      pencilCursor.style.top = e.clientY + 'px';
    }
  });

  // --- 2. CONTROLE DO MENU LATERAL MOBILE ---
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const sidebar = document.getElementById('mobile-sidebar');

  toggleBtn?.addEventListener('click', () => {
    sidebar?.classList.add('active');
    sidebar?.setAttribute('aria-hidden', 'false');
  });

  const closeSidebar = () => {
    sidebar?.classList.remove('active');
    sidebar?.setAttribute('aria-hidden', 'true');
  };

  closeSidebarBtn?.addEventListener('click', closeSidebar);
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // --- 3. PROGRESSO CINEMÁTICO DE ROLAGEM E REVEAL ---
  const scrollProgress = document.getElementById('scroll-progress');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const btnHome = document.getElementById('btn-home');

  const onScrollHandler = () => {
    // Barra de leitura superior
    const winScroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (height > 0 && scrollProgress) {
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    }

    // Surgimento de blocos na tela
    revealElements.forEach(el => {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < window.innerHeight * 0.88) {
        el.classList.add('visible');
      }
    });

    // Botão de retornar ao topo
    if (winScroll > 500) {
      btnHome?.classList.add('visible');
    } else {
      btnHome?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScrollHandler, { passive: true });
  onScrollHandler(); // Disparo inicial preventivo

  // --- 4. ENGINE DE BUSCA E ABAS SEM QUEBRA ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const artCards = document.querySelectorAll('.art-card');
  const searchBar = document.getElementById('gallery-search');
  let activeCategory = 'all';

  const runGalleryFilters = () => {
    const filterQuery = searchBar?.value.toLowerCase().trim() || "";

    artCards.forEach(card => {
      const isCorrectCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const isSearchMatch = card.dataset.title.includes(filterQuery);

      if (isCorrectCategory && isSearchMatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      activeCategory = btn.dataset.target;
      runGalleryFilters();
    });
  });

  searchBar?.addEventListener('input', runGalleryFilters);

  // --- 5. CONTROLE DE FAVORITOS (LOCALSTORAGE SEGURO) ---
  document.querySelectorAll('.btn-fav').forEach(favBtn => {
    const favId = favBtn.dataset.favId;
    
    if (localStorage.getItem(`franzen_fav_${favId}`) === 'true') {
      favBtn.classList.add('active');
    }

    favBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita a abertura acidental do Lightbox
      favBtn.classList.toggle('active');
      const isSaved = favBtn.classList.contains('active');
      localStorage.setItem(`franzen_fav_${favId}`, isSaved ? 'true' : 'false');
      triggerToast(isSaved ? "Salvo no seu rolo de favoritos!" : "Removido dos favoritos.");
    });
  });

  // --- 6. CICLO DE TEMAS DE PAPEL AVANÇADO ---
  const themeButton = document.getElementById('btn-theme');
  const themeList = ['artistico', 'pb', 'papel'];
  let activeThemeIndex = themeList.indexOf(document.body.getAttribute('data-theme') || 'artistico');

  const savedTheme = localStorage.getItem('franzen_app_theme');
  if (savedTheme && themeList.includes(savedTheme)) {
    document.body.setAttribute('data-theme', savedTheme);
    activeThemeIndex = themeList.indexOf(savedTheme);
  }

  themeButton?.addEventListener('click', () => {
    activeThemeIndex = (activeThemeIndex + 1) % themeList.length;
    const nextTheme = themeList[activeThemeIndex];
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('franzen_app_theme', nextTheme);
    triggerToast(`Textura alterada: Modo ${nextTheme.toUpperCase()}`);
  });

  // --- 7. NOTIFICAÇÕES TOAST INTEGRAIS ---
  function triggerToast(text) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    container.innerHTML = '';
    const toastBox = document.createElement('div');
    toastBox.className = 'toast';
    toastBox.textContent = text;
    container.appendChild(toastBox);
    setTimeout(() => { if (toastBox) toastBox.remove(); }, 2900);
  }

  // --- 8. LIGHTBOX DE ELITE COM ROTAÇÃO E CONTADOR ---
  const lightboxElement = document.getElementById('artist-lightbox');
  const lightboxImg = document.getElementById('lightbox-main-img');
  const lightboxCaption = document.getElementById('lightbox-main-caption');
  const lightboxCounter = document.getElementById('lightbox-main-counter');
  
  let operationalCards = [];
  let lightboxTrackIndex = 0;

  const renderLightboxView = () => {
    if (operationalCards.length === 0) return;
    const activeCard = operationalCards[lightboxTrackIndex];
    if (lightboxImg) lightboxImg.src = activeCard.dataset.full;
    if (lightboxCaption) lightboxCaption.textContent = activeCard.dataset.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${lightboxTrackIndex + 1} de ${operationalCards.length}`;
  };

  document.addEventListener('click', (e) => {
    const cardElement = e.target.closest('.art-card');
    if (!cardElement) return;

    operationalCards = Array.from(artCards).filter(c => c.style.display !== 'none');
    lightboxTrackIndex = operationalCards.indexOf(cardElement);

    if (lightboxTrackIndex !== -1 && lightboxElement) {
      renderLightboxView();
      lightboxElement.classList.add('active');
      lightboxElement.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });

  const dismissLightbox = () => {
    lightboxElement?.classList.remove('active');
    lightboxElement?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.getElementById('close-lightbox-btn')?.addEventListener('click', dismissLightbox);
  
  document.getElementById('next-lightbox-btn')?.addEventListener('click', () => {
    if (operationalCards.length <= 1) return;
    lightboxTrackIndex = (lightboxTrackIndex + 1) % operationalCards.length;
    renderLightboxView();
  });

  document.getElementById('prev-lightbox-btn')?.addEventListener('click', () => {
    if (operationalCards.length <= 1) return;
    lightboxTrackIndex = (lightboxTrackIndex - 1 + operationalCards.length) % operationalCards.length;
    renderLightboxView();
  });

  lightboxElement?.addEventListener('click', (e) => { if (e.target === lightboxElement) dismissLightbox(); });

  document.addEventListener('keydown', (e) => {
    if (!lightboxElement?.classList.contains('active')) return;
    if (e.key === 'Escape') dismissLightbox();
    if (e.key === 'ArrowRight') document.getElementById('next-lightbox-btn')?.click();
    if (e.key === 'ArrowLeft') document.getElementById('prev-lightbox-btn')?.click();
  });

  // Copiar link e retorno ao topo
  document.getElementById('btn-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => triggerToast("✔ Link da experiência copiado!"))
      .catch(() => triggerToast("Erro ao copiar."));
  });

  btnHome?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
      

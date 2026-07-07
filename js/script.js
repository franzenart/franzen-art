/**
 * Arquitetura de Controle do Sketchbook Digital FranzenArt
 * JavaScript vanila limpo, focado em segurança estática e UX fluida.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SEGUIDOR DE CURSOR DE PRECISÃO (✏️) ---
  const pencilCursor = document.getElementById('custom-pencil-cursor');
  if (pencilCursor) {
    document.addEventListener('mousemove', (e) => {
      pencilCursor.style.left = e.clientX + 'px';
      pencilCursor.style.top = e.clientY + 'px';
    });
  }

  // --- 2. GESTÃO DO MENU LATERAL E OVERLAY ---
  const toggleBtn = document.getElementById('menu-toggle-btn');
  const closeSidebarBtn = document.getElementById('close-sidebar-btn');
  const sidebar = document.getElementById('mobile-sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  const openMenu = () => {
    sidebar?.classList.add('active');
    overlay?.classList.add('active');
    sidebar?.setAttribute('aria-hidden', 'false');
  };

  const closeMenu = () => {
    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
    sidebar?.setAttribute('aria-hidden', 'true');
  };

  toggleBtn?.addEventListener('click', openMenu);
  closeSidebarBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // --- 3. CONTROLE DE IMAGENS E PLACEMENT PREVENTIVO CONTRA QUEBRAS ---
  const galleryImages = document.querySelectorAll('.gallery-img');
  galleryImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
      img.previousElementSibling?.remove();
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        img.previousElementSibling?.remove();
      });
      img.addEventListener('error', () => {
        if (img.previousElementSibling) {
          img.previousElementSibling.textContent = "Projeto em desenvolvimento";
        }
      });
    }
  });

  // --- 4. ENGINE DE ROLAGEM, PROGRESSO E SEÇÃO ATIVA ---
  const scrollProgress = document.getElementById('scroll-progress');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const btnHome = document.getElementById('btn-home');
  const navLinks = document.querySelectorAll('.menu-link');
  const sections = document.querySelectorAll('header, section');

  const monitorScroll = () => {
    const winScroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    
    if (height > 0 && scrollProgress) {
      scrollProgress.style.width = (winScroll / height) * 100 + '%';
    }

    revealElements.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('visible');
      }
    });

    if (winScroll > 450) { btnHome?.classList.add('visible'); } else { btnHome?.classList.remove('visible'); }

    let activeId = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (winScroll >= top) {
        activeId = sec.getAttribute('id') || "";
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active-nav');
      }
    });
  };

  window.addEventListener('scroll', monitorScroll, { passive: true });
  monitorScroll();

  // --- 5. CATEGORIZAÇÃO DE TABS ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const artCards = document.querySelectorAll('.art-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      const target = btn.dataset.target;
      artCards.forEach(card => {
        card.style.display = (target === 'all' || card.dataset.category === target) ? "block" : "none";
      });
    });
  });

  // --- 6. SWITCH DE APARÊNCIA LOCAL STORAGE (PROTEGIDO) ---
  const themeButton = document.getElementById('btn-theme');
  const themes = ['artistico', 'papel'];
  let currentThemeIdx = themes.indexOf(document.body.getAttribute('data-theme') || 'artistico');

  const savedTheme = localStorage.getItem('franzen_theme');
  if (savedTheme && themes.includes(savedTheme)) {
    document.body.setAttribute('data-theme', savedTheme);
    currentThemeIdx = themes.indexOf(savedTheme);
  }

  themeButton?.addEventListener('click', () => {
    currentThemeIdx = (currentThemeIdx + 1) % themes.length;
    const selected = themes[currentThemeIdx];
    document.body.setAttribute('data-theme', selected);
    localStorage.setItem('franzen_theme', selected);
    triggerToast(`Aparência alterada: Modo ${selected.toUpperCase()}`);
  });

  // --- 7. EMISSOR DE TOAST SEGURO (ANTI-XSS) ---
  function triggerToast(message) {
    const box = document.getElementById('toast-container');
    if (!box) return;
    box.innerHTML = '';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message; // Atribuição via textContent impede injeções
    box.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
  }

  // --- 8. VISUALIZADOR LIGHTBOX COM ARQUITETURA FOCUS TRAP ---
  const lightbox = document.getElementById('artist-lightbox');
  const lightboxImg = document.getElementById('lightbox-main-img');
  const lightboxCaption = document.getElementById('lightbox-main-caption');
  const lightboxCounter = document.getElementById('lightbox-main-counter');
  let filteredCards = [];
  let currentIdx = 0;
  let previousActiveElement = null;

  const renderLightboxFrame = () => {
    if (filteredCards.length === 0) return;
    const currentCard = filteredCards[currentIdx];
    
    // Filtro estrito antes da inserção
    const validatedSrc = currentCard.dataset.full;
    const validatedCaption = currentCard.dataset.caption;

    if (lightboxImg) lightboxImg.src = validatedSrc;
    if (lightboxCaption) lightboxCaption.textContent = validatedCaption;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIdx + 1} de ${filteredCards.length}`;
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.art-card');
    if (!card) return;

    previousActiveElement = document.activeElement;
    filteredCards = Array.from(artCards).filter(c => c.style.display !== 'none');
    currentIdx = filteredCards.indexOf(card);

    if (currentIdx !== -1 && lightbox) {
      renderLightboxFrame();
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightbox.focus();
    }
  });

  const closeLightbox = () => {
    lightbox?.classList.remove('active');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousActiveElement) previousActiveElement.focus();
  };

  document.getElementById('close-lightbox-btn')?.addEventListener('click', closeLightbox);
  
  const moveNext = () => {
    if (filteredCards.length <= 1) return;
    currentIdx = (currentIdx + 1) % filteredCards.length;
    renderLightboxFrame();
  };

  const movePrev = () => {
    if (filteredCards.length <= 1) return;
    currentIdx = (currentIdx - 1 + filteredCards.length) % filteredCards.length;
    renderLightboxFrame();
  };

  document.getElementById('next-lightbox-btn')?.addEventListener('click', moveNext);
  document.getElementById('prev-lightbox-btn')?.addEventListener('click', movePrev);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Escuta de comandos de acessibilidade teclado no lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') moveNext();
    if (e.key === 'ArrowLeft') movePrev();

    if (e.key === 'Tab') {
      const elements = lightbox.querySelectorAll('button, [tabindex="0"]');
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { last.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    }
  });

  // Utilitários adicionais
  document.getElementById('btn-copy-link')?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => triggerToast("Link copiado para a área de transferência."))
      .catch(() => triggerToast("Não foi possível copiar o link automaticamente."));
  });

  btnHome?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
    

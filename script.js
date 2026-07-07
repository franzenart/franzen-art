/**
 * Portfólio Oficial FranzenArt
 * Arquivo de Scripts Estruturado logicamente por módulos de performance
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- MÓDULO 1: ABAS DA GALERIA (ISOLAMENTO COMPLETO) ---
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Controle de Estados WAI-ARIA para Acessibilidade
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


  // --- MÓDULO 2: ALTERNAR TEMA E PERSISTÊNCIA ---
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


  // --- MÓDULO 3: ÁREA DE TRANSFERÊNCIA (CLIPBOARD) ---
  const btnCopy = document.getElementById('btn-copy-link');
  btnCopy?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast("✔ Link copiado com sucesso!"))
      .catch(() => showToast("Não foi possível copiar o link automaticamente."));
  });


  // --- MÓDULO 4: CENTRAL DE TOASTS ---
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    // Limpa toasts antigos para não acumular em cliques rápidos
    container.innerHTML = '';
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    
    setTimeout(() => { if(toast) toast.remove(); }, 2950);
  }


  // --- MÓDULO 5: LIGHTBOX COMPACTO (NAVEGAÇÃO PREMIUM) ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  let currentCards = [];
  let currentIndex = 0;

  // Atualiza a lista focando apenas na categoria visível no momento
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
  
  // Fechar clicando no fundo escuro fora do conteúdo
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Navegação Premium por Teclado (Acessibilidade)
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') moveNext();
    if (e.key === 'ArrowLeft') movePrev();
  });


  // --- MÓDULO 6: MONITORAMENTO DE SCROLL ---
  const btnHome = document.getElementById('btn-home');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btnHome?.classList.add('visible');
      btnHome?.setAttribute('aria-hidden', 'false');
    } else {
      btnHome?.classList.remove('visible');
      btnHome?.setAttribute('aria-hidden', 'true');
    }
  }, { passive: true });

  btnHome?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
    

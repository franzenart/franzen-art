document.addEventListener('DOMContentLoaded', () => {
  
  // 1. SISTEMA DE ABAS TOTALMENTE ISOLADO
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove a classe ativa de todos os botões e abas de conteúdo
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Ativa apenas a aba clicada
      tab.classList.add('active');
      const targetId = `category-${tab.dataset.target}`;
      const targetContent = document.getElementById(targetId);
      
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // 2. ALTERNAR VISUAL (TEMA ARTÍSTICO / P&B)
  const btnTheme = document.getElementById('btn-theme');
  
  // Carrega a preferência salva no navegador do usuário
  if (localStorage.getItem('franzen_theme') === 'pb') {
    document.body.classList.add('tema-pb');
  }

  btnTheme?.addEventListener('click', () => {
    document.body.classList.toggle('tema-pb');
    const isPB = document.body.classList.contains('tema-pb');
    localStorage.setItem('franzen_theme', isPB ? 'pb' : 'artistico');
    showToast(isPB ? "Visual alterado para Preto & Branco!" : "Visual alterado para Tema Artístico!");
  });

  // 3. COPIAR LINK DO PORTFÓLIO
  const btnCopy = document.getElementById('btn-copy-link');
  btnCopy?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast("✔ Link copiado para a área de transferência!"))
      .catch(() => showToast("Erro ao copiar link."));
  });

  // 4. TOAST NOTIFICATION DE CONFIRMAÇÃO
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // 5. LIGHTBOX PREMIUM (ZOMM DA IMAGEM)
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  let currentCards = [];
  let currentIndex = 0;

  const updateActiveCards = () => {
    const activeSection = document.querySelector('.tab-content.active');
    if (activeSection) {
      currentCards = Array.from(activeSection.querySelectorAll('.art-card'));
    }
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.art-card');
    if (!card) return;
    
    updateActiveCards();
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

  const nextImg = () => {
    if (currentCards.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentCards.length;
    openLightbox(currentCards[currentIndex]);
  };

  const prevImg = () => {
    if (currentCards.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
    openLightbox(currentCards[currentIndex]);
  };

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', nextImg);
  prevBtn?.addEventListener('click', prevImg);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // 6. BOTÃO VOLTAR AO TOPO
  const btnHome = document.getElementById('btn-home');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btnHome?.classList.add('visible');
    } else {
      btnHome?.classList.remove('visible');
    }
  });
  btnHome?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
    

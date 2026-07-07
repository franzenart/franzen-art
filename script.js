document.addEventListener('DOMContentLoaded', () => {
  
  // Lógica das Seções / Abas (Tabs)
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `category-${tab.dataset.target}`;
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // Lógica de Alternar Tema (Artistico / P&B)
  const btnTheme = document.getElementById('btn-theme');
  if (localStorage.getItem('franzen_theme') === 'pb') {
    document.body.classList.add('tema-pb');
  }
  btnTheme?.addEventListener('click', () => {
    document.body.classList.toggle('tema-pb');
    localStorage.setItem('franzen_theme', document.body.classList.contains('tema-pb') ? 'pb' : 'artistico');
    showToast("Visual alterado com sucesso!");
  });

  // Copiar Link com Toast
  const btnCopy = document.getElementById('btn-copy-link');
  btnCopy?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => showToast("✔ Link copiado para a área de transferência!"))
      .catch(() => showToast("Erro ao copiar link."));
  });

  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Lightbox Premium Integrado
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  
  let currentCards = [];
  let currentIndex = 0;

  // Atualiza a lista de cards clicáveis baseado na seção ativa
  const updateActiveCards = () => {
    const activeSection = document.querySelector('.tab-content.active');
    currentCards = Array.from(activeSection.querySelectorAll('.art-card'));
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.art-card');
    if (!card) return;
    
    updateActiveCards();
    currentIndex = currentCards.indexOf(card);
    openLightbox(card);
  });

  const openLightbox = (card) => {
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

  // Botão de Voltar ao Topo
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
                    

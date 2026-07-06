import { CONFIG } from './config.js';

export const ToastManager = (() => {
  let queue = [];
  let isProcessing = false;

  const show = (mensagem) => {
    queue.push(mensagem);
    if (!isProcessing) processQueue();
  };

  const processQueue = () => {
    if (queue.length === 0) {
      isProcessing = false;
      return;
    }

    isProcessing = true;
    const msg = queue.shift();
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    
    // Sobrescreve a animação de forma isolada
    toast.style.animation = `toastAnimation ${CONFIG.TOAST_DURATION}ms forwards`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
      processQueue();
    }, CONFIG.TOAST_DURATION);
  };

  return { show };
})();

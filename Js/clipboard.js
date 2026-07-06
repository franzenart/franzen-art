import { ToastManager } from './toast.js';

export const ClipboardManager = (() => {
  const init = () => {
    document.getElementById('btn-copy-link')?.addEventListener('click', () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url)
        .then(() => ToastManager.show('✔ Link do portfólio copiado.'))
        .catch(() => {
          const input = document.createElement('input');
          input.value = url; document.body.appendChild(input); input.select();
          document.execCommand('copy'); document.body.removeChild(input);
          ToastManager.show('✔ Link do portfólio copiado.');
        });
    });
  };
  return { init };
})();


document.addEventListener('DOMContentLoaded', () => {
  const a2hsBar = document.getElementById('a2hs-bar');
  const a2hsIcon = document.getElementById('a2hs-icon');
  const a2hsText = document.getElementById('a2hs-text');

  if (!a2hsBar || !a2hsIcon || !a2hsText) return;

  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    a2hsBar.style.display = 'flex';
    a2hsBar.classList.add('shrunk');
  });

  window.addEventListener('appinstalled', () => {
    a2hsBar.style.display = 'none';
  });

  function checkStandalone() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) a2hsBar.style.display = 'none';
  }
  checkStandalone();

  a2hsIcon.addEventListener('click', () => {
    a2hsBar.classList.toggle('shrunk');
  });

  a2hsText.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    a2hsText.disabled = true;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') a2hsBar.style.display = 'none';
    else a2hsText.disabled = false;
    deferredPrompt = null;
  });
});

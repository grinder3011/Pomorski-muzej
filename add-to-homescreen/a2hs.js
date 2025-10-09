// Add to Home Screen handler
let deferredPrompt;
const a2hsBar = document.getElementById('a2hs-bar');
const a2hsIcon = document.getElementById('a2hs-icon');
const a2hsText = document.getElementById('a2hs-text');

// Show install prompt when available
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (a2hsBar) {
    a2hsBar.style.display = 'flex';
    a2hsBar.classList.add('shrunk');
  }
});

// Hide if installed
window.addEventListener('appinstalled', () => {
  console.log("✅ App installed");
  if (a2hsBar) a2hsBar.style.display = 'none';
});

// Hide if already running as standalone
function checkStandalone() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone && a2hsBar) a2hsBar.style.display = 'none';
}
checkStandalone();

// Toggle shrink on icon click
if (a2hsIcon) {
  a2hsIcon.addEventListener('click', () => {
    a2hsBar.classList.toggle('shrunk');
  });
}

// Trigger install prompt on text click
if (a2hsText) {
  a2hsText.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    a2hsText.disabled = true;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') a2hsBar.style.display = 'none';
    else a2hsText.disabled = false;
    deferredPrompt = null;
  });
}

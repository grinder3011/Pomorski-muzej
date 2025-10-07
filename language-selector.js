const languageSelect = document.getElementById('language-select');
if (!languageSelect) throw new Error("Language selector not found.");

// Get saved language or default
let currentLang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
const supportedLangs = ['sl', 'en', 'it', 'de'];
if (!supportedLangs.includes(currentLang)) currentLang = 'sl';
localStorage.setItem('site_lang', currentLang);

// Highlight active language
function highlightActiveLang() {
  languageSelect.querySelectorAll('.lang-item').forEach(item => {
    if(item.dataset.value === currentLang) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
highlightActiveLang();

// Handle click on a language
languageSelect.querySelectorAll('.lang-item').forEach(item => {
  item.addEventListener('click', () => {
    const selectedLang = item.dataset.value;
    if(selectedLang === currentLang) return;

    currentLang = selectedLang;
    localStorage.setItem('site_lang', currentLang);
    highlightActiveLang();

    // Trigger translation reload
    if(window.loadTranslations) {
      window.loadTranslations("translations-home-page");
    } else {
      location.reload();
    }
  });
});

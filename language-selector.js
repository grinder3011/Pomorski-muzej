<script>
const languageBar = document.getElementById("language-bar");
const langOptions = languageBar.querySelectorAll(".lang-option");

// Determine saved language or default
let currentLang = localStorage.getItem('site_lang') || 'sl';

function setActiveLang(lang) {
  langOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.value === lang);
  });
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
}

// Initial highlight
setActiveLang(currentLang);

// Add click listeners
langOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const selectedLang = opt.dataset.value;
    if(selectedLang && selectedLang !== currentLang){
      setActiveLang(selectedLang);
      // Trigger translation reload (as previously done)
      import('./i18n.js').then(i18n => {
        i18n.loadTranslations("translations-home-page");
      });
    }
  });
});
</script>

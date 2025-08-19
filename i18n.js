export async function loadTranslations() {
  try {
    const supportedLangs = ['sl', 'en', 'it', 'de'];

    // Get current language from storage or browser
    let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
    if (!supportedLangs.includes(lang)) lang = 'sl';
    localStorage.setItem('site_lang', lang);

    // Detect page name (e.g. home-page from home-page.html or index from /)
    let page = window.location.pathname.split('/').pop().split('.')[0] || 'index';
    const jsonFileBaseName = `translations-${page}`;

    // GitHub Pages base path (e.g. /Pomorski-muzej)
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/');

    // Full path to translation file with cache-busting timestamp
    const path = `${basePath}/translations/${jsonFileBaseName}.json?t=${Date.now()}`;
    console.log('Fetching translation file:', path);

    // Fetch the translation file
    const res = await fetch(path);
    if (!res.ok) throw new Error('Translation file not found');

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`No translations found for language: ${lang}`);

    // Apply translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[key] || `[${key}]`;
    });

    // Language selector logic
    const select = document.getElementById('language-select');
    if (select) {
      if (select.value !== lang) select.value = lang;

      if (!select.dataset.listenerSet) {
        select.addEventListener('change', () => {
          const newLang = select.value;
          if (newLang && newLang !== lang) {
            localStorage.setItem('site_lang', newLang);
            location.reload(); // Reload to apply new language
          }
        });
        select.dataset.listenerSet = 'true';
      }
    }

  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

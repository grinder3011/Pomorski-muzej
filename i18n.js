export async function loadTranslations(jsonFileBaseName) {
  try {
    const supportedLangs = ['sl', 'en', 'it', 'de'];

    // Detect preferred language
    let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
    if (!supportedLangs.includes(lang)) lang = 'sl';

    // Save the selected language in localStorage
    localStorage.setItem('site_lang', lang);

    // GitHub Pages base path (e.g., /Pomorski-muzej)
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/');

    // Add cache buster to avoid stale fetches
    const path = `${basePath}/translations/${jsonFileBaseName}.json?t=${Date.now()}`;
    console.log('Fetching translation file:', path);

    const res = await fetch(path);
    if (!res.ok) throw new Error(`Translation file not found: ${path}`);

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`No translations found for language "${lang}"`);

    // Apply translations to elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[key] || `[${key}]`;
    });

    // Language selector logic
    const select = document.getElementById('language-select');
    if (select) {
      select.value = lang;

      // Avoid attaching multiple listeners
      if (!select.dataset.listenerSet) {
        select.addEventListener('change', () => {
          const newLang = select.value;
          if (newLang && newLang !== lang) {
            localStorage.setItem('site_lang', newLang);
            location.reload(); // Force reload to apply new language
          }
        });
        select.dataset.listenerSet = 'true';
      }
    }

  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

export async function loadTranslations(jsonFileBaseName) {
  try {
    const supportedLangs = ['sl', 'en', 'it', 'de'];

    // Detect or fall back to 'sl'
    let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
    if (!supportedLangs.includes(lang)) lang = 'sl';

    // Save language early
    localStorage.setItem('site_lang', lang);

    // Prevent caching issues by appending a timestamp
    const path = `translations/${jsonFileBaseName}.json?t=${Date.now()}`;
    console.log('Fetching translation file:', path);

    const res = await fetch(path);
    if (!res.ok) throw new Error('Translation file not found');

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`No translations found for language: ${lang}`);

    // Apply translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = translations[key];
      if (value) {
        el.textContent = value;
      } else {
        el.textContent = `[${key}]`; // fallback display
      }
    });

    // Set and sync language selector
    const select = document.getElementById('language-select');
    if (select) {
      if (select.value !== lang) select.value = lang;

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

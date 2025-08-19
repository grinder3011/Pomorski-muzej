export async function loadTranslations(jsonFileBaseName) {
  try {
    const supportedLangs = ['sl', 'en', 'it', 'de'];

    // Get saved or browser language
    let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
    if (!supportedLangs.includes(lang)) lang = 'sl';

    // Save language early, in case this is the first load
    localStorage.setItem('site_lang', lang);

    // Build path and fetch
    const path = `translations/${jsonFileBaseName}.json`;
    console.log('Fetching translation file:', path);
    const res = await fetch(path);
    if (!res.ok) throw new Error('Translation file not found');

    // Parse and apply translations
    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`Translations for language "${lang}" not found`);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[key] || `[${key}]`;
    });

    // Set up language selector
    const select = document.getElementById('language-select');
    if (select) {
      // Set value correctly once
      select.value = lang;

      // Avoid setting multiple event listeners
      if (!select.dataset.listenerSet) {
        select.addEventListener('change', () => {
          const newLang = select.value;
          if (newLang !== lang) {
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

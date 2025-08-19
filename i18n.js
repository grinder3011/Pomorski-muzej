export async function loadTranslations(jsonFileBaseName) {
  try {
    let lang = localStorage.getItem('site_lang') || (navigator.language || 'sl').split('-')[0];

    const supportedLangs = ['sl', 'en', 'it', 'de'];
    if (!supportedLangs.includes(lang)) lang = 'sl';

    // Adjusted fetch path to include 'translations/' folder
    const path = `translations/${jsonFileBaseName}.json`;
    console.log('Fetching translation file:', path);

    const res = await fetch(path);
    if (!res.ok) throw new Error('Translation file not found');

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`Translations for language "${lang}" not found`);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[key] || `[${key}]`;
    });

    const select = document.getElementById('language-select');
    if (select) {
      select.value = lang;

      select.addEventListener('change', () => {
        const newLang = select.value;
        if (newLang !== lang) {
          localStorage.setItem('site_lang', newLang);
          location.reload(); // Clean reload to apply new language
        }
      });
    }

    localStorage.setItem('site_lang', lang);

  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

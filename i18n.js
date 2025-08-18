export async function loadTranslations(jsonFileBaseName) {
  try {
    let lang = localStorage.getItem('site_lang') || (navigator.language || 'sl').split('-')[0];

    const supportedLangs = ['sl', 'en', 'it', 'de'];
    if (!supportedLangs.includes(lang)) lang = 'sl';

    const res = await fetch(`${jsonFileBaseName}.json`);
    if (!res.ok) throw new Error('Translation file not found');

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`Translations for language "${lang}" not found`);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = translations[key] || `[${key}]`;
    });

    const select = document.getElementById('language-select');
    if (select) select.value = lang;

    localStorage.setItem('site_lang', lang);

    if (select) {
      select.addEventListener('change', () => {
        const newLang = select.value;
        if (newLang !== lang) {
          localStorage.setItem('site_lang', newLang);
          location.reload();  // cleaner reload
        }
      });
    }

  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

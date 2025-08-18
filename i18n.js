export async function loadTranslations(jsonFileBaseName) {
  try {
    // Detect language: localStorage or browser fallback
    let lang = localStorage.getItem('site_lang') || navigator.language.slice(0, 2) || 'sl';

    // Supported languages list
    const supportedLangs = ['sl', 'en', 'it', 'de'];
    if (!supportedLangs.includes(lang)) lang = 'sl';

    // Fetch the single JSON file that contains all languages for the page
    const res = await fetch(`${jsonFileBaseName}.json`);
    if (!res.ok) throw new Error('Translation file not found');
    
    const allTranslations = await res.json();

    // Get translations for the current language only
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`Translations for language "${lang}" not found`);

    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });

    // Set the language selector value
    const select = document.getElementById('language-select');
    if (select) select.value = lang;

    // Save selected language for future
    localStorage.setItem('site_lang', lang);

    // Listen for language changes from the selector
    if (select) {
      select.addEventListener('change', () => {
        const newLang = select.value;
        localStorage.setItem('site_lang', newLang);
        // Reload page or re-run translations with new lang
        loadTranslations(jsonFileBaseName);
      });
    }

  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

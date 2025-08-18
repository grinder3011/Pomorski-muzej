export async function loadTranslations(pageFile, defaultLang = 'sl') {
  let lang = localStorage.getItem('lang') || navigator.language.slice(0, 2);
  const supported = ['sl', 'en', 'it', 'de'];

  if (!supported.includes(lang)) {
    lang = defaultLang;
  }

  try {
    const response = await fetch(`./i18n/${pageFile}.json`);
    if (!response.ok) throw new Error('Translation file not found');
    const allTranslations = await response.json();

    const translations = allTranslations[lang] || allTranslations[defaultLang];
    applyTranslations(translations);
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (translations[key]) elem.textContent = translations[key];
  });
}

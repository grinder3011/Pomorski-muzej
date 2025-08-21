export async function loadTranslations(jsonFileBaseName) {
  try {
    const supportedLangs = ['sl', 'en', 'it', 'de'];

    // Get the preferred language (from localStorage or browser language)
    let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
    
    // If the language is not supported, default to 'sl'
    if (!supportedLangs.includes(lang)) lang = 'sl';

    // Save the selected language in localStorage
    localStorage.setItem('site_lang', lang);

    // Determine the base path of your site (to support GitHub pages / subfolders)
    const repoRoot = '/Pomorski-muzej';
    const path = `${repoRoot}/translations/${jsonFileBaseName}.json?t=${Date.now()}`;
    console.log('Fetching translation file:', path);


    // Fetch the translation file
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Translation file not found: ${path}`);

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`No translations found for language "${lang}"`);

    // Store translations globally so that they can be accessed elsewhere
    window.translations = translations;

    // Apply translations to elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = translations[key];

      if (translation) {
        const link = el.querySelector('a');
        if (link) {
          link.textContent = translation;
        } else {
          replaceTextContent(el, translation);
        }
      } else {
        el.textContent = `[${key}]`;
      }
    });

    // Language selector logic
    const select = document.getElementById('language-select');
    if (select) {
      select.value = lang;
      if (!select.dataset.listenerSet) {
        select.addEventListener('change', () => {
          const newLang = select.value;
          if (newLang && newLang !== lang) {
            localStorage.setItem('site_lang', newLang);
            location.reload();
          }
        });
        select.dataset.listenerSet = 'true';
      }
    }

  } catch (err) {
    console.error('Error loading translations:', err);
  }
}

// Helper function to replace only the text nodes
function replaceTextContent(el, translation) {
  el.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      child.textContent = translation;
    }
  });
}

// ✅ New helper for JS lookups
export function t(key) {
  if (window.translations && window.translations[key]) {
    return window.translations[key];
  }
  return `[${key}]`; // fallback
}

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
    const basePath = window.location.pathname.split('/').slice(0, 2).join('/');

    // Build the path to the translation file
    const path = `${basePath}/translations/${jsonFileBaseName}.json?t=${Date.now()}`;
    console.log('Fetching translation file:', path);

    // Fetch the translation file
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Translation file not found: ${path}`);

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`No translations found for language "${lang}"`);

    // Apply translations to elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = translations[key];

      if (translation) {
        // If the element has an <a> tag, update only the text inside the <a> tag
        const link = el.querySelector('a');
        if (link) {
          link.textContent = translation;
        } else {
          // If there's no <a> tag, just replace text content
          replaceTextContent(el, translation);
        }
      } else {
        // Fallback: if no translation found, display the key (for debugging)
        el.textContent = `[${key}]`;
      }
    });

    // Language selector logic: apply selected language in the dropdown
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

// Helper function to replace only the text nodes and preserve emojis
function replaceTextContent(el, translation) {
  el.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      child.textContent = translation;
    }
  });
}

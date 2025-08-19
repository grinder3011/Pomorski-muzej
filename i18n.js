export async function loadTranslations(jsonFileBaseName) {
  try {
    const supportedLangs = ['sl', 'en', 'it', 'de'];

    // Detect preferred language
    let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
    if (!supportedLangs.includes(lang)) lang = 'sl';

    // Save the selected language in localStorage
    localStorage.setItem('site_lang', lang);

    // Get the current folder path relative to the root (handles subfolders)
    const currentPagePath = window.location.pathname.split('/').slice(0, -1).join('/'); // Exclude 'index.html'

    // Construct path to the translation file
    const translationPath = `${currentPagePath}/translations-${jsonFileBaseName}.json?t=${Date.now()}`;
    console.log('Fetching translation file:', translationPath);

    // Fetch the translation JSON file
    const res = await fetch(translationPath);
    if (!res.ok) throw new Error(`Translation file not found: ${translationPath}`);

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`No translations found for language "${lang}"`);

    // Apply translations to elements with 'data-i18n' attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = translations[key];

      if (translation) {
        // If there's an <a> tag, update only the text inside the <a> tag
        const link = el.querySelector('a');
        if (link) {
          link.textContent = translation;  // Update text inside <a> only
        } else {
          // If no <a> tag, update the text content of the element
          replaceTextContent(el, translation);
        }
      } else {
        // Fallback: leave the key as-is (for debugging)
        el.textContent = `[${key}]`;
      }
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

// Helper function to replace only the text nodes and preserve emojis
function replaceTextContent(el, translation) {
  // Loop through all child nodes of the element
  el.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      // Replace the text node with the translation
      child.textContent = translation;
    }
  });
}

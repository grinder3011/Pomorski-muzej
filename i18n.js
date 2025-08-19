export async function loadTranslations(jsonFileBaseName) {
  try {
    const supportedLangs = ['sl', 'en', 'it', 'de'];

    // First, get the saved language from localStorage, or detect the browser's language if not set
    let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
    if (!supportedLangs.includes(lang)) lang = 'sl';  // Default to 'sl' if language is not supported

    // Save the selected language in localStorage if it's not set
    localStorage.setItem('site_lang', lang);

    // Determine the correct base path (this works regardless of the folder structure)
    const basePath = window.location.pathname.split('/').slice(0, -1).join('/'); // Removes the current page name

    // Add cache buster to avoid stale fetches
    const path = `${basePath}/translations/${jsonFileBaseName}.json?t=${Date.now()}`;
    console.log('Fetching translation file:', path);

    const res = await fetch(path);
    if (!res.ok) throw new Error(`Translation file not found: ${path}`);

    const allTranslations = await res.json();
    const translations = allTranslations[lang];
    if (!translations) throw new Error(`No translations found for language "${lang}"`);

    // Apply translations to elements, updating only text content inside <a> tags
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = translations[key];

      if (translation) {
        // If the element has an <a> tag, update only the text inside the <a> tag
        const link = el.querySelector('a');
        if (link) {
          link.textContent = translation;  // Update only the text of <a>
        } else {
          // If there's no <a>, only replace text content
          replaceTextContent(el, translation);
        }
      } else {
        // In case no translation found, leave the key as fallback (debugging purpose)
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

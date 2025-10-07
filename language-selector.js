// language-selector.js — final version (handles nested translation targets properly)

import { loadTranslations } from './i18n.js';

(function(){
  const customSelect = document.getElementById("language-select");
  if (!customSelect) return;

  const optionNodes = Array.from(customSelect.querySelectorAll(".option, .lang-item"));
  const supportedLangs = ['sl','en','it','de'];

  let currentLang = localStorage.getItem('site_lang') || (navigator.language || navigator.userLanguage || 'sl').split('-')[0];
  if (!supportedLangs.includes(currentLang)) currentLang = 'sl';
  localStorage.setItem('site_lang', currentLang);

  function renderActive(lang) {
    optionNodes.forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-value') === lang);
    });

    const selectedOption = customSelect.querySelector('.selected-option');
    if (selectedOption) {
      const source = optionNodes.find(o => o.getAttribute('data-value') === lang);
      if (source) {
        while (selectedOption.firstChild) selectedOption.removeChild(selectedOption.firstChild);
        const srcImg = source.querySelector('img');
        if (srcImg) selectedOption.appendChild(srcImg.cloneNode(true));
        const srcSpan = source.querySelector('span');
        const spanText = document.createElement('span');
        spanText.textContent = srcSpan ? srcSpan.textContent : lang;
        selectedOption.appendChild(spanText);
        selectedOption.setAttribute('data-value', lang);
      }
    }
  }

  renderActive(currentLang);

  optionNodes.forEach(opt => {
    opt.addEventListener('click', async (e) => {
      e.preventDefault();
      const selected = opt.getAttribute('data-value');
      if (!selected || selected === currentLang) return;

      currentLang = selected;
      localStorage.setItem('site_lang', currentLang);
      renderActive(currentLang);

      // Re-run translations dynamically (no reload)
      await applyTranslations(currentLang);
    });
  });

  async function applyTranslations(lang) {
    try {
      // Dynamically load the correct translation file (like your main script does)
      await loadTranslations("translations-home-page", lang);

      // Handle nested elements manually — ensures <a><u>…</u></a> also update
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (!window.translations || !window.translations[key]) return;

        // If it has nested tags (like <u>), replace only text nodes
        if (el.children.length > 0) {
          el.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
              node.textContent = window.translations[key];
            }
          });
        } else {
          el.textContent = window.translations[key];
        }
      });
    } catch (err) {
      console.error("❌ Translation apply error:", err);
    }
  }

  // Initialize once for current language
  applyTranslations(currentLang);
})();

// language-selector.js (safe, compatible, drop-in)
// Works with either:
//  - <div id="language-select"> containing .lang-item (horizontal bar), or
//  - the older structure with .selected-option + .options .option
//
// It WILL NOT modify any elements that carry data-i18n (museum links etc).

(function(){
  const customSelect = document.getElementById("language-select");
  if (!customSelect) return; // nothing to do

  // Find both possible option selectors (old and new)
  const optionNodes = Array.from(customSelect.querySelectorAll(".option, .lang-item"));

  // supported languages
  const supportedLangs = ['sl','en','it','de'];

  // determine current language (localStorage preferred)
  let currentLang = localStorage.getItem('site_lang') || (navigator.language || navigator.userLanguage || 'sl').split('-')[0];
  if (!supportedLangs.includes(currentLang)) currentLang = 'sl';
  // persist
  localStorage.setItem('site_lang', currentLang);

  // Helper: set active class on option nodes and update selected-option (if present)
  function renderActive(lang){
    // mark active option(s)
    optionNodes.forEach(opt => {
      try {
        opt.classList.toggle('active', opt.getAttribute('data-value') === lang);
      } catch(e) { /* ignore */ }
    });

    // If there is a .selected-option (legacy), update it safely without touching other DOM
    const selectedOption = customSelect.querySelector('.selected-option');
    if (selectedOption) {
      // Find source option to take flag + label from
      const source = optionNodes.find(o => o.getAttribute('data-value') === lang);
      if (source) {
        // Remove only children of selectedOption and rebuild with clones of small elements
        // (keep this confined to the selector only)
        while (selectedOption.firstChild) selectedOption.removeChild(selectedOption.firstChild);

        const srcImg = source.querySelector('img');
        if (srcImg) {
          const imgClone = srcImg.cloneNode(true);
          selectedOption.appendChild(imgClone);
        }
        const spanText = document.createElement('span');
        const srcSpan = source.querySelector('span');
        spanText.textContent = srcSpan ? srcSpan.textContent : lang;
        selectedOption.appendChild(spanText);

        selectedOption.setAttribute('data-value', lang);
      }
    }

    // Set a value on the select element so other scripts can read it if they rely on it
    try { customSelect.value = lang; } catch(e){ /* ignore if not supported */ }
  }

  // Initial render
  renderActive(currentLang);

  // Click handler for all options
  optionNodes.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      const selected = opt.getAttribute('data-value');
      if (!selected || selected === currentLang) return;

      // Update currentLang and persist immediately
      currentLang = selected;
      localStorage.setItem('site_lang', currentLang);

      // Update UI
      renderActive(currentLang);

      // Dispatch change on the container (safe — won't break anything)
      try {
        const changeEvent = new Event('change', { bubbles: true });
        customSelect.dispatchEvent(changeEvent);
      } catch (err) {
        // ignore
      }

      // Finally reload so your existing i18n.js loadTranslations() (which reads localStorage)
      // runs exactly as before and updates all translations.
      location.reload();
    });
  });

  // Expose a programmatic setter (keeps compatibility with older code)
  try {
    Object.defineProperty(customSelect, "value", {
      get() {
        return localStorage.getItem('site_lang') || currentLang;
      },
      set(val) {
        if (!val) return;
        if (!supportedLangs.includes(val)) return;
        // mimic a click on matching option
        const opt = optionNodes.find(o => o.getAttribute('data-value') === val);
        if (opt) opt.click();
      }
    });
  } catch (e) {
    // some older browsers may not allow defineProperty on DOM elements - ignore
  }

})();

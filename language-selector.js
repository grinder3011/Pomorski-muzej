// language-selector.js
const customSelect = document.getElementById("language-select");
if (!customSelect) throw new Error("Language selector not found.");

// Grab all language buttons
const langItems = customSelect.querySelectorAll(".lang-item");

// Helper: set active highlight
function setActiveLang(lang) {
  langItems.forEach(item => {
    if (item.getAttribute("data-value") === lang) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
  // Update customSelect.value so i18n.js sees it
  customSelect.value = lang;
  // Dispatch a change event so translations apply
  const changeEvent = new Event("change");
  customSelect.dispatchEvent(changeEvent);
}

// Get preferred language from localStorage or browser
let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
const supportedLangs = ['sl','en','it','de'];
if (!supportedLangs.includes(lang)) lang = 'sl';
localStorage.setItem('site_lang', lang);
setActiveLang(lang);

// Click handlers
langItems.forEach(item => {
  item.addEventListener("click", () => {
    const newLang = item.getAttribute("data-value");
    if (newLang && newLang !== lang) {
      localStorage.setItem('site_lang', newLang);
      setActiveLang(newLang);
      location.reload(); // reload triggers translation for all elements
    }
  });
});

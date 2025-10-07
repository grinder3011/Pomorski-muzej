// language-selector.js - fully rewritten for horizontal language bar
const languageBar = document.getElementById("language-select");
if (!languageBar) throw new Error("Language bar not found.");

// Get all language items
const langItems = languageBar.querySelectorAll(".lang-item");

// Determine current language from localStorage or browser
let currentLang = localStorage.getItem("site_lang") || navigator.language.split("-")[0];
if (!["sl","en","it","de"].includes(currentLang)) currentLang = "sl";
localStorage.setItem("site_lang", currentLang);

// Highlight the active language
function updateActiveHighlight() {
  langItems.forEach(item => {
    if (item.getAttribute("data-value") === currentLang) {
      item.classList.add("active-lang");
    } else {
      item.classList.remove("active-lang");
    }
  });
}
updateActiveHighlight();

// Handle click on language items
langItems.forEach(item => {
  item.addEventListener("click", () => {
    const selectedLang = item.getAttribute("data-value");
    if (selectedLang && selectedLang !== currentLang) {
      localStorage.setItem("site_lang", selectedLang);
      currentLang = selectedLang;
      updateActiveHighlight();
      // reload page to trigger i18n.js translation
      location.reload();
    }
  });
});

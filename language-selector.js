// language-selector.js (horizontal bar version)
const customSelect = document.getElementById("language-select");
if (!customSelect) throw new Error("Language selector not found.");

const options = customSelect.querySelectorAll(".option");

// Initialize active language from localStorage or default
let currentLang = localStorage.getItem("site_lang") || "sl";

function setActive(lang) {
  currentLang = lang;
  localStorage.setItem("site_lang", lang);

  options.forEach(opt => {
    opt.classList.toggle("active", opt.dataset.value === lang);
  });

  // Trigger the change event for i18n.js
  const changeEvent = new Event("change");
  customSelect.value = lang;
  customSelect.dispatchEvent(changeEvent);
}

// Initial highlight
setActive(currentLang);

// Handle clicks on language options
options.forEach(opt => {
  opt.addEventListener("click", () => {
    const selectedLang = opt.dataset.value;
    if (selectedLang !== currentLang) {
      setActive(selectedLang);
    }
  });
});

// language-selector.js
import { loadTranslations } from "./i18n.js";

const langSelect = document.getElementById("language-select");
if (!langSelect) throw new Error("Language selector (#language-select) not found.");

const langButtons = document.querySelectorAll(".lang-btn");

// Helper to set language programmatically
async function setLanguage(lang) {
  // Update hidden select for compatibility
  langSelect.dataset.value = lang;

  // Update button highlight
  langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === lang);
  });

  // Fire custom event for backward compatibility
  langSelect.dispatchEvent(new CustomEvent("languageChange", { detail: { value: lang } }));

  // Load translations for this page only once per click
  await loadTranslations("translations-home-page", lang);
}

// Button click handler
langButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    const lang = btn.dataset.value;
    localStorage.setItem("selectedLang", lang);
    await setLanguage(lang);
  });
});

// Restore previously selected language on page load
(async () => {
  const savedLang = localStorage.getItem("selectedLang");
  if (savedLang) {
    await setLanguage(savedLang);
  } else {
    // Default language from the active button
    const activeBtn = document.querySelector(".lang-btn.active");
    if (activeBtn) {
      await setLanguage(activeBtn.dataset.value);
    }
  }
})();

// Optional: allow setting language from other scripts
Object.defineProperty(langSelect, "value", {
  get() {
    return langSelect.dataset.value;
  },
  set(val) {
    setLanguage(val);
  }
});

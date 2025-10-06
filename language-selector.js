// language-selector.js

// Get hidden select for backward compatibility
const langSelect = document.getElementById("language-select");
if (!langSelect) throw new Error("Language selector (#language-select) not found.");

// Get the visible language buttons
const langButtons = document.querySelectorAll(".lang-btn");

// Helper function to set active button and dispatch event
function setActiveLanguage(lang) {
  // Update hidden select's dataset
  langSelect.dataset.value = lang;

  // Update button highlight
  langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === lang);
  });

  // Dispatch custom event so other scripts can respond (translations)
  langSelect.dispatchEvent(new CustomEvent("languageChange", { detail: { value: lang } }));
}

// Button click handlers
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.value;
    localStorage.setItem("selectedLang", lang); // remember selection
    setActiveLanguage(lang);
  });
});

// Restore previously selected language on page load
const savedLang = localStorage.getItem("selectedLang");
if (savedLang) {
  setActiveLanguage(savedLang);
} else {
  // Default from active button
  const activeBtn = document.querySelector(".lang-btn.active");
  if (activeBtn) setActiveLanguage(activeBtn.dataset.value);
}

// Optional: allow setting language from other scripts
Object.defineProperty(langSelect, "value", {
  get() {
    return langSelect.dataset.value;
  },
  set(val) {
    setActiveLanguage(val);
  }
});

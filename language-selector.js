// language-selector.js
const langSelect = document.getElementById("language-select");
if (!langSelect) throw new Error("Language selector (#language-select) not found.");

const langButtons = document.querySelectorAll(".lang-btn");

// Helper to update active button and dispatch event
function updateLanguage(lang) {
  // Update hidden select for backward compatibility
  langSelect.dataset.value = lang;

  // Highlight active button
  langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.value === lang);
  });

  // Dispatch event for translation loader
  langSelect.dispatchEvent(new CustomEvent("languageChange", { detail: { value: lang } }));
}

// Button click handler
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.value;
    localStorage.setItem("selectedLang", lang);
    updateLanguage(lang);
  });
});

// Restore previously selected language on page load (without fetching translations)
const savedLang = localStorage.getItem("selectedLang");
if (savedLang) {
  updateLanguage(savedLang);
} else {
  const activeBtn = document.querySelector(".lang-btn.active");
  if (activeBtn) {
    updateLanguage(activeBtn.dataset.value);
  }
}

// Optional: allow setting language from other scripts
Object.defineProperty(langSelect, "value", {
  get() {
    return langSelect.dataset.value;
  },
  set(val) {
    updateLanguage(val);
  }
});

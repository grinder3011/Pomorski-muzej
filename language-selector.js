const langBar = document.getElementById("language-select");
if (!langBar) throw new Error("Language selector not found.");

const langItems = langBar.querySelectorAll(".lang-item");

function setActiveLang(lang) {
  langItems.forEach(item => {
    if(item.getAttribute("data-value") === lang) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Get preferred language from localStorage or browser
let lang = localStorage.getItem('site_lang') || navigator.language.split('-')[0];
const supportedLangs = ['sl','en','it','de'];
if(!supportedLangs.includes(lang)) lang = 'sl';
localStorage.setItem('site_lang', lang);
setActiveLang(lang);

// Add click handlers
langItems.forEach(item => {
  item.addEventListener("click", () => {
    const newLang = item.getAttribute("data-value");
    if(newLang && newLang !== lang) {
      localStorage.setItem('site_lang', newLang);
      location.reload();
    }
  });
});

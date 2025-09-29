// language-selector.js
const customSelect = document.getElementById("language-select");
if (!customSelect) throw new Error("Language selector not found.");

const selectedOption = customSelect.querySelector(".selected-option");
const optionsContainer = customSelect.querySelector(".options");

// Toggle dropdown open/close
customSelect.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

// Handle selection click
optionsContainer.querySelectorAll(".option").forEach(option => {
  option.addEventListener("click", (e) => {
    e.stopPropagation();
    const value = option.getAttribute("data-value");
    const label = option.querySelector("span").textContent;
    const flag = option.querySelector("img").src;

    selectedOption.innerHTML = `<img src="${flag}" alt="${label}"><span>${label}</span><span class="arrow">▾</span>`;
    selectedOption.setAttribute("data-value", value);
    customSelect.classList.remove("open");

    // Hide selected option in dropdown
    optionsContainer.querySelectorAll(".option").forEach(opt => {
      opt.style.display = (opt.getAttribute("data-value") === value) ? "none" : "flex";
    });

    // Reload page in selected language
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/');
    // Assuming folder structure: /<lang>/<rest-of-path>
    if(parts.length > 1) {
      parts[1] = value; // replace language folder
      const newPath = parts.join('/');
      window.location.href = newPath;
    }
  });
});

// Close dropdown if clicked outside
document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});

// Property to get/set value programmatically
Object.defineProperty(customSelect, "value", {
  get() { return selectedOption.getAttribute("data-value"); },
  set(val) {
    const option = optionsContainer.querySelector(`.option[data-value="${val}"]`);
    if(option) option.click();
  }
});

// Initialize dropdown visibility
(function initDropdown() {
  const currentValue = selectedOption.getAttribute("data-value");
  optionsContainer.querySelectorAll(".option").forEach(opt => {
    opt.style.display = (opt.getAttribute("data-value") === currentValue) ? "none" : "flex";
  });
})();

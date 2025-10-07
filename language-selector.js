const customSelect = document.getElementById("language-select");
if (!customSelect) throw new Error("Language selector not found.");

const selectedOption = customSelect.querySelector(".selected-option");
const optionsContainer = customSelect.querySelector(".options");

// Initialize active state
const initActive = () => {
  const currentValue = selectedOption.getAttribute("data-value");
  optionsContainer.querySelectorAll(".option").forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-value") === currentValue);
  });
};
initActive();

// Handle option click
optionsContainer.querySelectorAll(".option").forEach(option => {
  option.addEventListener("click", e => {
    e.stopPropagation();
    const value = option.getAttribute("data-value");
    const label = option.textContent.trim();
    const flag = option.querySelector("img").src;

    selectedOption.innerHTML = `<img src="${flag}" alt="${label}"><span>${label}</span>`;
    selectedOption.setAttribute("data-value", value);

    // Update active class
    optionsContainer.querySelectorAll(".option").forEach(opt => {
      opt.classList.toggle("active", opt.getAttribute("data-value") === value);
    });

    // Trigger change for i18n.js
    const changeEvent = new Event("change");
    customSelect.value = value;
    customSelect.dispatchEvent(changeEvent);
  });
});

// Optional dropdown toggle
customSelect.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

// Programmatic value support
Object.defineProperty(customSelect, "value", {
  get() {
    return selectedOption.getAttribute("data-value");
  },
  set(val) {
    const option = optionsContainer.querySelector(`.option[data-value="${val}"]`);
    if (option) option.click();
  }
});

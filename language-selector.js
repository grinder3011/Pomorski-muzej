// language-selector.js

document.querySelectorAll('.custom-select').forEach(customSelect => {
  const selectedOption = customSelect.querySelector(".selected-option");
  const optionsContainer = customSelect.querySelector(".options");

  // Open/close dropdown
  customSelect.addEventListener("click", () => customSelect.classList.toggle("open"));

  // Handle option click
  optionsContainer.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = option.getAttribute("data-value");

      // Reload page with selected language
      const url = new URL(window.location);
      url.searchParams.set('lang', value);
      window.location.href = url.toString();
    });
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) customSelect.classList.remove("open");
  });
});

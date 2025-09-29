document.addEventListener("DOMContentLoaded", () => {
  const customSelect = document.getElementById("language-select");
  if (!customSelect) return; // ✅ prevent console errors if not present

  const selectedOption = customSelect.querySelector(".selected-option");
  const optionsContainer = customSelect.querySelector(".options");

  customSelect.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  optionsContainer.querySelectorAll(".option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      const value = option.getAttribute("data-value");
      const label = option.querySelector("span").textContent;
      const flag = option.querySelector("img").src;

      // Update UI
      selectedOption.innerHTML = `
        <img src="${flag}" alt="${label}">
        <span>${label}</span>
        <span class="arrow">▾</span>
      `;
      selectedOption.setAttribute("data-value", value);
      customSelect.classList.remove("open");

      // Update URL (reload with ?lang=xx)
      const url = new URL(window.location.href);
      url.searchParams.set("lang", value);
      window.location.href = url.toString();
    });
  });

  // Close if click outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });
});

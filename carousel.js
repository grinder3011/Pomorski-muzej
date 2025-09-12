export function initCarousel(carouselSelector) {
  document.querySelectorAll(carouselSelector).forEach(carousel => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector(".carousel-btn.prev");
    const nextBtn = carousel.querySelector(".carousel-btn.next");

    let currentIndex = 0;

    function updateSlidePosition() {
      const slideWidth = slides[0].offsetWidth; // use offsetWidth for exact pixel width
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextBtn.addEventListener("click", () => {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0; // loop back to first
      }
      updateSlidePosition();
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = slides.length - 1; // loop to last
      }
      updateSlidePosition();
    });

    // Handle window resize (recalculate width)
    window.addEventListener("resize", updateSlidePosition);

    // Initialize correct position
    updateSlidePosition();
  });
}

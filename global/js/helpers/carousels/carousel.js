import hash from "object-hash";
import ChevronRight from "../SVG-library/ChevronRight";

/**
 * Carousel package
 *
 * @param {Object} options - Carousel options
 * @param {Array} options.slides - The slides within the carousel
 * @param {string} [options.variant="single"] - The variant of the carousel
 * @param {string} [options.uniqueClass=""] - Unique class for styling
 * @param {boolean} [options.isDark=false] - Dark mode flag
 * @returns {string} - HTML string
 */
export function Carousel({ slides, variant = "single", uniqueClass = "", isDark = false }) {
  if (!Array.isArray(slides) || slides.length === 0) return "";

  const variants = {
    cards: {
      breakpoints: {
        0: { slidesPerView: 1.5, spaceBetween: 40, centeredSlides: true },
        768: { slidesPerView: 3, spaceBetween: 72, centeredSlides: false },
        992: { slidesPerView: 3, spaceBetween: 102, centeredSlides: false },
      },
      slidesPerView: 1.5,
      spaceBetween: 40,
      variantClassName: "component-slider-cards component-slider-peek",
      loop: true,
    },
    "vertical-videos": {
      breakpoints: {
        0: { slidesPerView: 1.4, spaceBetween: 20, centeredSlides: true },
        576: { slidesPerView: 1.6, spaceBetween: 20, centeredSlides: true },
        768: { slidesPerView: 1.9, spaceBetween: 50, centeredSlides: true },
      },
      slidesPerView: 1,
      variantClassName: "component-slider-single component-slider-vertical-videos component-slider-peek",
      loop: true,
    },
    single: {
      slidesPerView: 1,
      variantClassName: "component-slider-single",
      loop: false,
    },
  };

  const variantData = variants[variant] || variants["single"];

  const slidesMarkup = slides
    .map(
      (slide) => `
      <div class="swiper-slide" data-hash="${hash.MD5(JSON.stringify(slide))}">
        ${slide}
      </div>
    `
    )
    .join("");

  return `
    <div class="component-slider ${isDark ? "su-slider-dark" : ""}">
      <div class="swiper ${variantData.variantClassName}">
        <div class="swiper-wrapper">
          ${slidesMarkup}
        </div>
        <div class="swiper-pagination component-slider-pagination-${uniqueClass}"></div>
      </div>
      <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
        <nav aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-${uniqueClass} su-mr-full"></nav>
        <button class="component-slider-btn component-slider-prev" type="button">
          <span class="sr-only">Previous</span>
          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
            ${ChevronRight()}
          </span>
        </button>
        <button class="component-slider-btn component-slider-next" type="button">
          <span class="sr-only">Next</span>
          <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
            ${ChevronRight()}
          </span>
        </button>
      </div>
    </div>
  `;
}

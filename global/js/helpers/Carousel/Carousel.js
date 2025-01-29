import { ChevronRight } from "../SVG-library";

export function Carousel({ variant = "cards", slides, uniqueClass = "", isDark = false }) {
    const variantMap = new Map();
    variantMap.set(
        "imagegallery",
        `<div class="component-slider ${isDark ? "su-slider-dark" : ""}">
            <div class="swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-watch-progress component-slider-imagegallery swiper-backface-hidden">
                <div class="swiper-wrapper">
                    ${slides}
                </div>
            </div>
            <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-${uniqueClass} su-mr-full"></div>
                <button class="component-slider-btn component-slider-prev" type="button">
                    <span class="sr-only">Previous</span>
                    <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                        ${ChevronRight({ className: "" })}
                    </span>
                </button>
                <button class="component-slider-btn component-slider-next" type="button">
                    <span class="sr-only">Next</span>
                    <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                        ${ChevronRight({ className: "" })}
                    </span>
                </button>
            </div>
        </div>`
    );
    
    variantMap.set(
        "cards",
        `<div class="component-slider ${isDark ? "su-slider-dark" : ""}">
            <div class="swiper component-slider-cards component-slider-peek">
                <div class="swiper-wrapper">
                    ${slides}
                </div>
            </div>
            <div class="component-slider-controls su-flex su-mt-45 lg:su-mt-48 su-items-center su-content-center">
                <div aria-label="Slide Navigation" class="component-slider-pagination component-slider-pagination-${uniqueClass} su-mr-full"></div>
                <button class="component-slider-btn component-slider-prev" type="button">
                    <span class="sr-only">Previous</span>
                    <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                        ${ChevronRight({ className: "" })}
                    </span>
                </button>
                <button class="component-slider-btn component-slider-next" type="button">
                    <span class="sr-only">Next</span>
                    <span aria-hidden="true" class="su-absolute su-top-[50%] su-left-[50%] su-translate-y-[-50%] su-translate-x-[-50%] su-inline-block">
                        ${ChevronRight({ className: "" })}
                    </span>
                </button>
            </div>
        </div>`
    );

    return variantMap.get(variant);
}

export default Carousel;
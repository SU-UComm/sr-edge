import { container } from '../grids/container';

/**
 * Creates a basic hero section
 * 
 * @param {Object} data - Hero content data
 * @returns {string} HTML string of the hero section
 */
export function basicHero({ data }) {
  const { title, pubDateFormatted, media, summary } = data;

  return `
    ${container({
      children: `
        <header class="basic-story__header su-relative su-w-full su-max-w-[1512px] su-mx-auto su-grid su-grid-cols-6 sm:su-grid-cols-12">
          <div class="su-relative su-pr-20 sm:su-pl-20 lg:su-pl-20 sm:su-pr-0 su-flex su-col-span-5 su-col-start-2 sm:su-col-span-6 sm:su-col-start-6">
            <h1 class="su-z-10 su-relative su-text-[46px] md:su-text-[80px] lg:su-text-[128px] su-font-serif su-text-right su-leading-[54.92px] md:su-leading-[96px] lg:su-leading-[153.6px]">
              ${title}
            </h1>
          </div>
          <div class="su-w-2 su-h-[60%] su-absolute su-left-20 sm:su-left-[10%] su-top-[80px] lg:su-top-[240px] su-bg-gradient su-z-0"></div>
          <div class="su-w-[10%] sm:su-w-[25%] su-h-2 su-absolute su-left-20 sm:su-left-[10%] su-top-[80px] lg:su-top-[239px] su-bg-gradient su-z-0"></div>
          <div class="su-w-2 su-h-[60%] su-absolute su-right-20 sm:su-right-[10%] su-bottom-0 su-bg-gradient su-z-0"></div>

          <figure class="basic-story__header-image su-flex su-flex-col su-gap-6 su-col-span-full su-relative su-translate-y-[-110px] sm:su-translate-y-[-130px] lg:su-translate-y-[-200px] xl:su-translate-y-[-220px] su-z-0 md:su-gap-18 lg:su-gap-15">
            <div class="su-relative">
              <img
                src="${media.featureImage.url}"
                alt="${media.featureImage.alt}"
                class="su-relative su-w-full su-h-[300px] sm:su-h-500 lg:su-h-[764px] su-object-cover su-object-center"
              />
              <div class="su-absolute su-top-[-1%] dark:su-top-0 su-left-0 su-h-[101%] su-w-full su-bg-repeat su-bg-center su-bg-cover"></div>
            </div>
            ${(media.caption || media.credit) ? `
              <figcaption class="su-text-14 su-w-3/4 su-mx-auto su-text-center su-m-0 su-leading-[16.72px] md:su-text-16 md:su-leading-[19.11px]">
                ${media.caption} ${media.caption && media.credit ? ' | ' : ''}
                ${media.credit}
              </figcaption>
            ` : ''}
          </figure>

          <p class="su-col-span-5 su-col-start-2 sm:su-col-span-6 sm:su-col-start-3 su-pr-40 sm:su-pr-20 su-h-min su-mx-auto su-font-semibold su-text-left font-serif-4 su-text-20 su-leading-[23.88px] md:su-text-22 md:su-leading-[28.75px] lg:su-text-[32px] lg:su-leading-[41.68px]">
            ${summary}
          </p>

          <span class="su-col-span-full su-pr-40 su-col-start-2 sm:su-col-span-4 sm:su-col-start-7 su-mt-[71px] su-flex su-items-start su-flex-row md:su-flex-row su-justify-end su-text-16 su-leading-[19.1px] md:su-text-22 md:su-leading-[28.75px] md:su-basefont-23">
            <time class="su-m-0 md:su-mt-0 md:su-mr-4 su-font-semibold">
              ${pubDateFormatted}
            </time>
          </span>
        </header>
      `
    })}
  `;
}

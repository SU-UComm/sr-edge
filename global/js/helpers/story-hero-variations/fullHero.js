import { container } from '../grids/container';
import xss from 'xss';
import { readingTime } from './readingTime';

/**
 * Creates a full width hero section
 * 
 * @param {Object} data - Hero content data
 * @returns {string} HTML string of the hero section
 */
export function fullHero({ data }) {
  const { title, pubDateFormatted, media, summary } = data;
  const titleSize = "su-leading-[119.4%] md:su-leading-[120%] su-text-[4.6rem] sm:su-text-[6.1rem] lg:su-text-[9.5rem]";

  return `
    ${container({
      width: "wide",
      children: `
        <header class="featured-story__header-v2 su-relative">
          <div class="su-relative su-w-screen su-left-[50%] su-translate-x-[-50%]">
            <img
              class="su-w-full su-max-w-none"
              src="${media.featureImage.url}"
              alt="${media.featureImage.alt}"
            />
            <div class="su-bg-gradient-to-t su-from-white su-via-[rgb(255_255_255/.5)_8%] dark:su-from-black-true dark:su-via-[rgb(0_0_0/.5)_8%] su-to-50% su-absolute su-w-full su-h-full su-bottom-0 su-left-0"></div>
          </div>

          <div id="main-content" class="su-relative su-z-10 su-grid su-grid-cols-6 md:su-items-center md:su-grid-cols-12 su-gap-y-0 su-grid-gap md:su-px-0 su-flex-wrap su-mx-auto su-pt-[11.4rem] -su-mt-[16.2rem]">
            <div class="su-col-span-6 md:su-col-span-7 md:su-col-start-1 lg:su-col-span-8 lg:su-col-start-1 lg:su-pr-30">
              <h1 class="${[
                "su-text-shadow-title su-shadow-white dark:su-shadow-black-true su-text-left su-w-full su-break-words su-my-0 md:su-rs-py-6 lg:su-rs-py-5 md:su-text-right su-font-serif",
                titleSize,
              ].join(" ")}">
                ${title}
              </h1>
            </div>
            <div class="su-hidden md:su-block md:su-col-span-1 md:su-col-start-8 lg:su-col-start-9 lg:su-col-span-4 su-h-full lg:su-hidden">
              <div class="su-bg-gradient-light-red su-h-full su-w-3 su-left-0 su-top-0 su-mx-auto"></div>
            </div>
            <div class="su-relative su-mt-50 md:su-mt-0 su-col-span-6 su-pl-32 md:su-pl-0 md:su-col-span-4 md:su-col-start-9 su-self-stretch lg:su-pl-48 lg:su-translate-x-[1.5rem]">
              <div class="su-flex su-flex-col su-h-full">
                <div class="md:su-hidden su-absolute su-bg-gradient-light-red su-h-full su-w-3 su-left-0 su-top-0 lg:su-block"></div>
                <p class="${[
                  "su-text-shadow-title su-shadow-white dark:su-shadow-black-true lg:su-max-w-[29.2rem] su-m-0 su-font-serif su-text-20 su-leading-[119.4%] su-mb-rs-5 md:su-text-21 md:su-leading-[130.245%] md:su-pb-72 lg:su-text-24 su-font-semibold",
                  "su-pb-80 md:su-pb-0",
                ].join(" ")}">
                  ${xss(summary)}
                </p>
                <span class="su-w-auto md:su-mt-auto su-text-16 su-leading-[19.1px] su-flex su-gap-[7px] md:su-basefont-23 md:su-text-21 md:su-leading-[26.25px]">
                  <time class="su-m-0 md:su-mt-0 md:su-mr-[4px] su-font-semibold">
                    ${pubDateFormatted}
                  </time>
                  | [TO FIX - integrate with readingTime.js] min read
                </span>
              </div>
            </div>
          </div>
        </header>
      `
    })}
  `;
}

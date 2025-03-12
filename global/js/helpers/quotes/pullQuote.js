import { avatar } from './avatar';

/**
 * Creates a pull quote component
 *
 * @param {string} quote - The quote text
 * @param {string} avatar - URL of the avatar image
 * @param {string} imageAlt - Alt text for the avatar
 * @param {string} name - Name of the person quoted
 * @param {string} title - Title/job of the person quoted
 * @param {string} avatarSize - Size of the avatar (small, medium, large)
 * @param {string} tag - HTML tag to use (div or article)
 * @return {string} HTML string of the pull quote
 */
export function pullQuote({
  quote,
  avatarUrl,
  imageAlt = "",
  name,
  title,
  avatarSize = "large",
  tag = "div"
}) {
  return quote ? `
    <${tag}
      class="su-component-pullquote su-mx-auto su-relative su-mt-0 su-flex su-flex-wrap su-gap-27 su-justify-center su-pr-0 su-py-0"
    >
      ${avatar({ image: avatarUrl, avatarSize, alt: imageAlt })}
      <blockquote
        class="${[
          "su-w-full su-pl-39 dark:su-text-white dark:before:su-text-white su-font-serif su-text-black",
          avatarSize === "large" ? "lg:su-pl-[5.2rem]" : "lg:su-pl-0",
        ].join(" ")}"
      >
        <div class="${[
          "su-font-semibold su-font-serif-0 su-text-[2.4rem] md:su-text-[3.6rem] su-leading md:su-leading-[130.245%]",
          "[&>*:last-child]:su-mb-0 [&>*:last-child]:after:su-content-[\u0022]\u0022",
          "su-relative before:su-text-[73px] before:su-leading-[109.5px] lg:before:su-leading-[139.5px] lg:before:su-text-[93px] before:su-font-semibold before:su--mt-25 lg:before:su--mt-38 before:su-content-[\u0022] before:su-text-serif before:su-text-black dark:su-text-white before:su-absolute before:su-right-full lg:before:su-right-full before:su-mr-6 lg:before:su-mr-13 dark:before:su-text-white",
          "su-leading-[33.6px] md:su-leading-[46.89px]",
        ].join(" ")}"
        >
          ${quote}
        </div>
        ${name ? `
          <cite class="su-mt-15 md:su-mt-26 lg:su-mt-29 su-font-sans su-text-21 su-leading-[25.2px] su-flex su-flex-col">
            <span class="su-font-bold su-block su-leading-[25.2px]">
              ${name}
            </span>
            ${title ? `
              <span class="su-block su-leading-[25.2px]">${title}</span>
            ` : ''}
          </cite>
        ` : ''}
      </blockquote>
    </${tag}>
  ` : "";
}

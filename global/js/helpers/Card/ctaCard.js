import { cnb } from "cnbuilder";
import xss from "xss";
import ChevronRight from "../SVG-library/ChevronRight";
import ExternalArrowUnstyled from "../SVG-library/ExternalArrowUnstyled";
/**
 * CTA Card styles
 */
const styles = {
  root: "su-group su-relative su-w-full su-flex su-flex-col su-break-words su-rounded-[8px] su-rs-pt-5 su-rs-px-4 su-max-w-900 su-mx-auto su-transition-shadow su-border dark:su-border-2 su-border-black-30/30 dark:su-border-black su-shadow dark:su-shadow-black/80 su-bg-white dark:su-bg-black-true su-text-black dark:su-text-white",
  eyebrow: "su-type-1 su-text-black-60 su-font-semibold su-rs-mb-1",
  heading: "su-type-5 md:su-type-4 2xl:su-type-3 su-mb-0 su-font-sans su-text-black dark:su-text-white",
  link: "group-hocus-within:su-underline su-stretched-link su-text-black dark:su-text-white group-hocus-within:su-text-digital-red dark:group-hocus-within:su-text-digital-red-light",
  description: "su-text-black dark:su-text-white su-big-paragraph su-rs-mt-4 *:su-leading-snug *:last:su-mb-0",
  iconWrapper: "su-flex su-rs-mt-1 su-transition-transform su-items-center su-justify-center su-size-50 md:su-size-70 su-rounded-full su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark dark:su-from-olive dark:su-to-palo-verde su-ml-auto",
  externalIcon: "su-inline-block su-w-20 md:su-w-30 su-text-white dark:su-text-black-true *:su-stroke-3",
  internalIcon: "su-fill-transparent su-stroke-current su-inline-block su-w-22 md:su-w-36 su-text-white dark:su-text-black-true *:su-stroke-3"
};

/**
 * Creates a CTA card HTML structure
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the card
 * @param {string} props.eyebrow - Superheading above the title
 * @param {string} props.description - Body text of the card
 * @param {string} props.internalUrl - Internal link to Matrix asset
 * @param {string} props.externalUrl - Manually entered external link
 * @param {boolean} props.isNewWindow - Whether the link should open in a new window
 * @returns {string} HTML string for the card
 */
export function CtaCard({
  title,
  eyebrow,
  description,
  internalUrl,
  externalUrl,
  isNewWindow,
}) {
  const hasLink = !!internalUrl || !!externalUrl;
  const isRealExternalLink = !!externalUrl && !externalUrl?.includes("news.stanford.edu");
  const url = internalUrl || externalUrl;

  return `
    <article 
      aria-label="${title}"
      class="${styles.root} ${hasLink ? 'hover:su-shadow-md focus-within:su-shadow-md' : ''} ${hasLink ? 'su-rs-pb-4' : 'su-rs-pb-5'}"
    >
      ${eyebrow ? `
        <span aria-hidden class="${styles.eyebrow}">
          ${eyebrow}
        </span>
      ` : ''}

      <h3 class="${styles.heading}">
        ${hasLink ? `
          <a href="${url}"
             ${isNewWindow ? 'target="_blank"' : ''}
             ${isRealExternalLink ? 'rel="noopener nofollow"' : ''}
             class="${styles.link}">
            ${eyebrow ? `<span class="su-sr-only">${eyebrow}:</span>` : ''}
            ${title}
            ${isRealExternalLink ? '<span class="su-sr-only">(link is external)</span>' : ''}
          </a>
        ` : `
          ${eyebrow ? `<span class="su-sr-only">${eyebrow}:</span>` : ''}
          ${title}
        `}
      </h3>

      ${description ? `
        <div class="su-grow">
          <div data-test="cta-card-content" class="${styles.description}">
            ${xss(description)}
          </div>
        </div>
      ` : ''}

      ${hasLink ? `
        <div class="su-mt-auto">
          <div class="${styles.iconWrapper} ${isRealExternalLink ? 
            'group-hocus-within:su-translate-x-02em group-hocus-within:su--translate-y-02em' : 
            'group-hocus-within:su-translate-x-03em'}">
            ${isRealExternalLink ? `
              ${ExternalArrowUnstyled({
                "stroke-width": 3,
                class: styles.externalIcon,
                "aria-hidden": true
              })}` : `
              ${ChevronRight({
                class: styles.internalIcon,
                width: null,
                height: null,
                "aria-hidden": true
              })}
            `}
          </div>
        </div>
      ` : ''}
    </article>
  `;
}

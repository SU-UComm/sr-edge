import { cnb } from "cnbuilder";
import { FAIcon } from "../icons/FAIcon"; 

/**
 * Generates a linked heading as an HTML string for server-side rendering.
 *
 * @param {Object} props Configuration object
 * @param {string} props.title The main title
 * @param {string} [props.ctaText="View all"] The call to action text
 * @param {string} props.ctaLink The call to action URL
 * @param {boolean} props.ctaNewWindow Whether to open in a new window
 * @param {boolean} props.isAlwaysLight Whether to always use light theme
 * @param {string} props.className Additional CSS classes
 * @returns {string} The HTML string
 */
export function LinkedHeading({
  title,
  ctaText = "View all",
  ctaLink,
  ctaNewWindow,
  isAlwaysLight,
  className,
}) {
  if (!title) return ""; // Return empty string instead of null for SSR

  const containerClass = cnb(
    "su-component-line-heading su-flex su-flex-wrap su-items-baseline su-gap-5 su-gap-x-13 md:su-gap-13",
    className
  );

  const headingClass = cnb(
    "su-type-3 su-font-serif su-w-full md:su-w-auto su-mb-8 md:su-mb-0 dark:su-text-white",
    isAlwaysLight ? "su-text-white" : "su-text-black"
  );

  const ctaHtml = ctaLink
    ? `<a 
        data-test="cta"
        href="${ctaLink}"
        ${ctaNewWindow ? 'target="_blank"' : ""}
        class="${cnb(
          "su-group su-flex su-no-underline hocus:su-underline su-transition su-items-center md:su-items-end md:su-mb-8 lg:su-mb-12 su-flex-nowrap su-align-baseline su-gap-20 md:su-gap-13 su-text-19 su-decoration-2 dark:su-text-white",
          isAlwaysLight
            ? "su-text-white hocus:su-text-white/95 dark:hocus:su-text-white/95"
            : "su-text-black hocus:su-text-digital-red dark:hocus:su-text-dark-mode-red"
        )}"
      >
        <span class="su-flex su-gap-2 su-items-baseline">
          <span>${ctaText}<span class="sr-only">${title}</span></span>
          ${FAIcon({
            icon: "chevron-right",
            set: "solid",
            attributes: {
              width: 18,
              classes: "fa-fw su-text-14 group-hocus:su-translate-x-02em su-transition-transform"
            }
          })}
        </span>
      </a>`
    : "";


  return `
    <div class="${containerClass}">
      <h2 class="${headingClass}">${title}</h2>
      <hr aria-hidden="true" class="md:su-mb-11 lg:su-mb-15 su-grow su-border-none su-bg-gradient-light-red-h su-h-4" />
      ${ctaHtml}
    </div>
  `;
}

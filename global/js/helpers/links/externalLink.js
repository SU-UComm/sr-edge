import { cnb } from "cnbuilder";
import { FAIcon } from "../icons/FAIcon";

/**
 * Creates an external link with an arrow icon
 *
 * @param {string} liveUrl - The URL to link to
 * @param {string} ctaText - The text of the link (defaults to "Read more")
 * @param {string} ctaSize - The size of the CTA (small or large)
 * @return {string} HTML string of the link
 */
export function externalLink({
  liveUrl,
  ctaText = "Read more",
  ctaSize = "small",
}) {
  const ctaSizeClasses = new Map();
  ctaSizeClasses.set("small", "");
  ctaSizeClasses.set(
    "large",
    "su-font-semibold su-text-21 su-leading-[26.25px]"
  );

  return liveUrl ? `
    <a
      data-test="size-${ctaSize}"
      class="${cnb(
        "su-group su-component-external-link su-flex su-items-center su-flex-nowrap su-text-digital-red su-no-underline dark:su-text-dark-mode-red",
        "hocus:su-underline hocus:su-text-black dark:hocus:su-text-white",
        ctaSizeClasses.get(ctaSize)
      )}"
      href="${liveUrl}"
    >
      <span data-test="ctaText">${ctaText}</span>
      ${FAIcon({
          icon: "arrow-up-right",
          set: "regular",
          attributes:{
            width: 12,
            classes: "su-inline-block su-ml-5 su-text-18 su-text-digital-red dark:su-text-dark-mode-red group-hocus:su-text-black dark:group-hocus:su-text-white group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em su-transition-transform",
            "data-testid": "svg-externalarrow"
          }
        })}
      
    </a>` : "";
}

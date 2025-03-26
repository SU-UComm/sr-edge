import { cnb } from "cnbuilder";
import { FAIcon } from "../icons/FAIcon";

/**
 * Creates a link that looks like a button
 *
 * @param {string} ctaType - Type of CTA = 'link' | 'email' | 'download'
 * @param {string} internalUrl - Internal link to Matrix asset
 * @param {string} externalUrl - Manually entered external link
 * @param {string} email - Email address for mailto link
 * @param {string} buttonText - The text of the link
 * @param {boolean} isNewWindow - Whether the link should open in a new window
 * @param {string} size - Size of the button = "default" | "large"
 * @param {string} variant - Variant of the button = "default" | "gradient"
 * @param {string} className - Additional className for spacing etc
 * @return {string} HTML string of the button link
 */
export function linkButton({
  ctaType = "link",
  internalUrl,
  externalUrl,
  email,
  buttonText = "Button text",
  isNewWindow,
  variant = "default",
  size = "default",
  className,
}) {
  const isRealExternalLink =
    !!externalUrl && !externalUrl?.includes("news.stanford.edu");

  
  let icon = "";
  if (ctaType === "email") {
    icon = "envelope";
  } else if (ctaType === "download") {
    icon = "arrow-down-to-line";
  } else if (isRealExternalLink) {
    icon = "arrow-up";
  }

  return (internalUrl || externalUrl || email) ? `
    <a
      class="${cnb(
        "su-group su-flex su-items-center su-w-fit hocus:su-underline",
        size === "large"
          ? "su-rs-py-0 su-rs-px-4 su-font-semibold su-type-1 dark:hocus:su-ring-2"
          : "su-px-30 su-pt-12 su-pb-14 su-text-18 md:su-text-20 dark:hocus:su-ring-1",
        variant === "gradient"
          ? "su-text-white hocus:su-text-white su-no-underline hocus:su-underline su-bg-gradient-to-r su-from-digital-red-light su-to-cardinal-red-dark hocus:su-bg-none hocus:su-bg-black dark:su-from-olive dark:su-to-palo-verde dark:su-text-black-true dark:hocus:su-text-white dark:hocus:su-ring-white"
          : "su-button dark:hocus:su-ring-white",
        className
      )}"
      href="${externalUrl || internalUrl || `mailto:${email}`}"
      ${isNewWindow ? 'target="_blank"' : ''}
      ${isRealExternalLink ? 'rel="noopener nofollow"' : ''}
    >
      ${buttonText}
      ${(isRealExternalLink || ctaType === "email" || ctaType === "download") ? `
        ${FAIcon({
          icon,
          set: "regular",
          attributes: {
            width: size === "large" ? 30 : 20,
            classes: cnb(
              "fa-fw su-inline-block su-shrink-0 su-text-white group-hocus:su-text-white su-text-[0.9em] su-ml-04em su-transition-transform",
              variant === "gradient" &&
                "dark:su-text-black-true dark:group-hocus:su-text-white su-duration-100",
              icon === "arrow-up" &&
                "su-rotate-45 group-hocus:su-translate-x-01em group-hocus:su--translate-y-01em",
              ctaType === "email" && "group-hocus:su-translate-x-02em",
              ctaType === "download" && "group-hocus:su-translate-y-02em"
            ),
            title: isRealExternalLink && ctaType !== "download" ? "External link" : ""
          }
        })}
      ` : ''}
    </a>` : "";
}

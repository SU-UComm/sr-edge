import { SidebarHeading } from "../headings";
import { ChevronRight, ExternalArrow } from "../SVG-library";

/**
 * Creates a sidebar list with heading and CTA
 *
 * @param {string} children - The list content
 * @param {string} title - The title text
 * @param {string} icon - The icon to display before title
 * @param {string} ctaUrl - URL for the CTA below list
 * @param {string} ctaText - Text for the CTA
 * @param {string} ctaIcon - Icon displayed after CTA text
 * @param {string} headingLvl - Heading level (h2, h3, etc)
 * @return {string} HTML string of the sidebar list
 */
export function sidebarList({
  children,
  title,
  icon,
  ctaUrl,
  ctaText = "See all",
  ctaIcon = "chevronright",
  headingLvl = "h2"
}) {
  const iconMap = new Map();
  iconMap.set("chevronright", ChevronRight());
  iconMap.set("externalarrow", ExternalArrow({size: "small"}));

  const iconAlignments = new Map();
  iconAlignments.set("chevronright", "group-hocus:su-translate-x-01em");
  iconAlignments.set(
    "externalarrow",
    "group-hocus:su--translate-y-01em group-hocus:su-translate-x-01em [&>svg]:su-translate-y-1"
  );

  return children ? `
    <div class="su-component-sidebar-list su-flex su-flex-wrap su-gap-27">
      ${title ? `
        ${SidebarHeading({
          title,
          icon,
          headingSize: headingLvl
        })}
      ` : ''}
      
      ${children}
      
      ${ctaUrl ? `
        <a
          data-test="cta"
          href="${ctaUrl}"
          class="su-items-center su-group su-transition su-justify-center md:su-justify-start su-w-full su-flex su-text-digital-red dark:su-text-dark-mode-red su-flex-nowrap su-gap-2 su-leading-[125%] su-text-21 su-font-semibold su-no-underline hocus:su-underline *:su-transition"
        >
          <span>${ctaText}</span>
          <span class="su-transition ${iconAlignments.get(ctaIcon)}">
            ${iconMap.get(ctaIcon)}
          </span>
        </a>
      ` : ''}
    </div>
  ` : "";
}

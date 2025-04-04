import { library, icon as faIconRenderer } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/pro-solid-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";

/**
 * We currently include the PRO solid and regular sets of FontAwesome icons.
 * We can expand this to include more sets in the future as needed.
 * https://fontawesome.com/search?o=r&s=solid%2Cregular
 */

// Add all the FA icons in the regular and solid sets to the library
library.add(far, fas);

const iconSets = {
  regular: "far",
  solid: "fas",
};

/**
 * A wrapper function for rendering FontAwesome icons from the pro solid and regular styles.
 * Supports either `iconName` or `icon` as the icon identifier, with `iconName` taking precedence.
 *
 * @param {Object} options - The configuration object for the icon
 * @param {string} [options.iconName] - The primary name of the icon (e.g., "arrow-up"). Takes precedence over `icon`.
 * @param {string} [options.icon] - The alternative name of the icon (e.g., "chevron-right"). Used if `iconName` is not provided.
 * @param {string} [options.set="solid"] - The FontAwesome icon set to use. Options: "solid" or "regular".
 * @param {Object} [options.attributes={}] - Additional attributes to pass to the FontAwesome icon renderer.
 * @param {number} [options.attributes.width] - The width of the icon in pixels.
 * @param {string} [options.attributes.title] - The title attribute for accessibility.
 * @param {string} [options.attributes.className] - CSS class(es) to apply to the icon.
 * @returns {string} The rendered SVG HTML string for the icon, or an empty string if no valid icon is found.
 * @example
 * // Using iconName
 * FAIcon({ iconName: "arrow-up", attributes: { classes: "my-class" } });
 * // Using icon
 * FAIcon({ icon: "chevron-right", set: "regular", attributes: { width: 18 } });
 */
export function FAIcon({ iconName, icon, set = 'solid', attributes = {} }) {
  const resolvedIconName = iconName || icon || "";
  const selectedSet = iconSets[set];
  const faIcon = faIconRenderer({ prefix: selectedSet, iconName: resolvedIconName }, attributes);

  return faIcon ? faIcon.html[0] : "";
}

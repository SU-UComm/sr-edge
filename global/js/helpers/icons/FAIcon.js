import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/pro-solid-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";

/**
 * We currently include the PRO solid and regular sets of FontAwesome icons.
 * We can expand this to include more sets in the future as needed.
 * https://fontawesome.com/search?o=r&s=solid%2Cregular
 */

/**
 * A wrapper component for FontAwesome icons that allow you to use any icon from the free solid and regular styles
 * https://fontawesome.com/search?o=r&s=solid%2Cregular
 *
 * @param {string} icon
 * The name of the icon
 *
 * @param {string} set
 * The FontAwesome icon set - solid | regular
 *
 * @param {object} attributes
 * Any other props you want to pass to the FontAwesomeIcon component
 *
 * @return {string}
 */

const iconSets = {
  regular: "far",
  solid: "fas",
};

export function FAIcon({ iconName, set = 'solid', attributes = {} }) {
  // Add all the FA icons in the regular and solid sets to the library
  library.add(far, fas);

  const selectedSet = iconSets[set];

  const faIcon = icon(selectedSet[iconName], attributes);

  return faIcon ? faIcon.html[0] : "";
}


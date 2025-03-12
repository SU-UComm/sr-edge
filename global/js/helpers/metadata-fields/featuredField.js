/**
 * Creates a featured metadata field
 *
 * @param {string} title - Field title
 * @param {string} children - Field content
 * @param {string} alignment - Content alignment (left or center)
 * @returns {string} HTML string of the field
 */
export function featuredField({ title, children, alignment = "left" }) {
  const alignMap = new Map();
  alignMap.set("left", "su-text-left");
  alignMap.set("center", "su-text-center");

  return `
    <div class="${alignMap.get(alignment)}">
      <h3 class="su-metadata-fields-title su-text-15 su-leading-display su-font-bold su-font-sans !su-m-0 su-pb-8 md:su-pb-9 md:su-text-19">
        ${title}
      </h3>
      <div>${children}</div>
    </div>
  `;
}

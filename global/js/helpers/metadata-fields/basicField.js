/**
 * Creates a basic metadata field
 *
 * @param {string} title - Field title
 * @param {string} children - Field content
 * @param {string} alignment - Content alignment (left or center)
 * @param {string} contentCSS - Additional CSS classes for content
 * @returns {string} HTML string of the field
 */
export function basicField({
  title,
  children,
  alignment = "left",
  contentCSS = "",
}) {
  const alignMap = new Map();
  alignMap.set("left", "su-justify-left");
  alignMap.set("center", "su-justify-center");

  return `
    <div class="su-flex su-flex-col su-gap-27 su-pt-32 su-pb-22 md:su-pt-45 md:su-pt-36 ${alignMap.get(alignment)}">
      <h3 class="su-text-23 su-font-bold su-leading-[27.6px] su-font-sans !su-m-0">
        ${title}
      </h3>
      <div class="su-flex su-flex-col su-gap-6 su-text-21 ${contentCSS}">
        ${children}
      </div>
    </div>
  `;
}

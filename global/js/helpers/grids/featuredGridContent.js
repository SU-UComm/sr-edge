/**
 * GridContent helper
 *
 * @param {string} children The children (content) inside the component as an HTML string
 * @param {number} placement The position within the grid
 * @param {string} alignment The alignment of the featured grid item (placement 1)
 * @param {boolean} isNested Whether the item is nested
 * @returns {string} The generated HTML string
 */
export function featuredGridContent({
  children = "",
  placement,
  alignment = "left",
  isNested = false,
}) {
  const alignClasses = new Map();
  alignClasses.set("right", "md:su-order-2");
  alignClasses.set("left", "");

  // Featured placement
  if (placement === 1) {
    return `<div class="md:su-basis-[58.333%] lg:su-basis-[64.5%] su-grow ${alignClasses.get(alignment)}">${children}</div>`;
  }
  
  // Supplementary, top position
  if (placement === 2) {
    return `<div class="su-relative su-w-full">${children}</div>`;
  }
  
  // Catch all for all additional supplementary items (3+)
  const beforeClasses = isNested
    ? "md:before:su-w-full lg:before:su-w-px lg:before:su-h-full before:su-left-0 lg:before:su-left-[-38px] before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-0"
    : "before:su-left-0 before:su-top-[-40px] md:before:su-top-[-36px] lg:before:su-top-[-38px]";

  return `<div class="su-relative su-w-full before:su-w-full before:su-absolute before:su-bg-black-30 dark:before:su-bg-black before:su-h-px ${beforeClasses}">${children}</div>`;
}
